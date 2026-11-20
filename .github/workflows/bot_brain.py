import os
import subprocess
import xml.etree.ElementTree as ET
import urllib.request
import json

REPO = os.environ["GITHUB_REPOSITORY"]
OWNER, REPO_NAME = REPO.split("/")
TOKEN = os.environ["GH_TOKEN"]
EVENT_NAME = os.environ["EVENT_NAME"]
BRANCH = os.environ["TARGET_BRANCH"]
WF_NAME = os.environ.get("WF_NAME", "Manual")
WF_STATUS = os.environ.get("WF_STATUS", "success")
RUN_URL = os.environ.get("RUN_URL", "")

CONFIG_PATH = "config.xml"


def gh_api(endpoint, method="GET", data=None):
    url = f"https://github.com{endpoint}" if endpoint.startswith("/") else endpoint
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/vnd.github+json")
    if data:
        req.add_header("Content-Type", "application/json")
        req.data = json.dumps(data).encode("utf-8")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_codeql_details():
    try:
        alerts = gh_api(f"/repos/{REPO}/code-scanning/alerts?state=open&per_page=5")
        if not alerts:
            return "Workflow failed (check syntax or build logs)."
        lines = []
        for a in alerts:
            rule = a.get("rule", {}).get("description", "Security/Syntax issue")
            path = a.get("most_recent_instance", {}).get("location", {}).get("path", "unknown file")
            lines.append(f"`{path}`: {rule}")
        return "; ".join(lines)
    except Exception:
        return "Syntax error or dangerous code flagged during CodeQL scan."


def post_issue(issue_num, body):
    gh_api(f"/repos/{REPO}/issues/{issue_num}/comments", method="POST", data={"body": body})
    print(f"Posted to Issue #{issue_num}")


def post_discussion(disc_num, body):
    query_id = """
    query($owner: String!, $repo: String!, $num: Int!) {
      repository(owner: $owner, name: $repo) {
        discussion(number: $num) { id }
      }
    }
    """
    res = gh_api("/graphql", method="POST", data={
        "query": query_id,
        "variables": {"owner": OWNER, "repo": REPO_NAME, "num": int(disc_num)}
    })
    disc_id = res["data"]["repository"]["discussion"]["id"]

    mutation = """
    mutation($id: ID!, $body: String!) {
      addDiscussionComment(input: {discussionId: $id, body: $body}) {
        comment { id }
      }
    }
    """
    gh_api("/graphql", method="POST", data={
        "query": mutation,
        "variables": {"id": disc_id, "body": body}
    })
    print(f"Posted to Discussion #{disc_num}")


def execute_action(target_type, number, branch, raw_msg, attach_file):
    details = get_codeql_details() if "codeql" in WF_NAME.lower() else f"Status: {WF_STATUS}"
    body = (
        raw_msg.strip()
        .replace("{branch}", branch)
        .replace("{workflow}", WF_NAME)
        .replace("{status}", WF_STATUS)
        .replace("{run_url}", RUN_URL)
        .replace("{details}", details)
    )

    if attach_file.strip():
        file_url = f"https://github.com{REPO}/blob/{branch}/{attach_file.strip()}"
        body += f"\n\n📎 **Attached File:** [`{attach_file.strip()}`]({file_url})"

    if target_type == "Issues":
        post_issue(number, body)
    elif target_type == "Discussions":
        post_discussion(number, body)
    elif target_type == "Compare Branches":
        compare_url = f"https://github.com{REPO}/compare/main...{branch}"
        full_msg = f"{body}\n\n🔀 **Compare Branches:** [main ↔ {branch}]({compare_url})"
        if str(number).isdigit() and int(number) > 0:
            post_discussion(number, full_msg)
        else:
            print(f"Generated Compare URL: {compare_url}")


def save_to_xml(branch, target_type, number, message, attach_file):
    tree = ET.parse(CONFIG_PATH)
    root = tree.getroot()
    rule = ET.SubElement(root, "rule", id=f"custom-{os.environ.get('GITHUB_RUN_NUMBER', '1')}", workflow="any", status="any")
    ET.SubElement(rule, "branch").text = branch
    ET.SubElement(rule, "type").text = target_type
    ET.SubElement(rule, "number").text = str(number)
    ET.SubElement(rule, "attach_file").text = attach_file
    ET.SubElement(rule, "message").text = message
    ET.indent(tree, space="    ")
    tree.write(CONFIG_PATH, encoding="utf-8", xml_declaration=True)


def main():
    if EVENT_NAME == "workflow_dispatch":
        target_type = os.environ["INPUT_TYPE"]
        number = os.environ["INPUT_NUMBER"]
        message = os.environ["INPUT_MESSAGE"]
        attach_file = os.environ["INPUT_ATTACH"]
        save_flag = os.environ["INPUT_SAVE"]

        if save_flag == "true":
            save_to_xml(BRANCH, target_type, number, message, attach_file)

        execute_action(target_type, number, BRANCH, message, attach_file)
    else:
        tree = ET.parse(CONFIG_PATH)
        for rule in tree.getroot().findall("rule"):
            r_wf = rule.attrib.get("workflow", "any")
            r_status = rule.attrib.get("status", "any")
            r_branch = (rule.findtext("branch") or "all").strip()

            if r_wf not in ("any", WF_NAME):
                continue
            if r_status not in ("any", WF_STATUS):
                continue
            if r_branch not in ("all", BRANCH):
                continue

            execute_action(
                rule.findtext("type").strip(),
                rule.findtext("number").strip(),
                BRANCH,
                rule.findtext("message") or "",
                rule.findtext("attach_file") or ""
            )


if __name__ == "__main__":
    main()
