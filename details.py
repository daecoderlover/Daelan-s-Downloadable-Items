import os
import webbrowser
import shutil
import zipfile
import sys

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))

BROWSER_FILES = {
    "index.html": "https://daecoderlover.github.io/Daelan-s-Downloadable-Items/"
}

ARCHIVE_EXT = [".daex", ".dae"]

def list_repo_files():
    """Show all files in the repo"""
    print("\n📂 Files in your repository:")
    print("-" * 50)
    for item in sorted(os.listdir(REPO_ROOT)):
        path = os.path.join(REPO_ROOT, item)
        if os.path.isfile(path):
            print(f"  📄 {item}")
        elif os.path.isdir(path) and not item.startswith("."):
            print(f"  📁 {item}/")
    print("-" * 50)

def open_browser_file(filename):
    """Open website link for index.html"""
    url = BROWSER_FILES.get(filename)
    if url:
        print(f"🌐 Opening {url} ...")
        if os.name == 'nt':
            webbrowser.open(url)
        else:
            os.system(f"termux-open-url '{url}'")
            print("✅ Opening in your browser...")
        return True
    return False

def handle_archive(filename):
    """Treat .daex/.dae as zip — list contents, let user pick"""
    filepath = os.path.join(REPO_ROOT, filename)
    
    # Make temp zip copy
    temp_zip = filepath + ".temp.zip"
    try:
        shutil.copy2(filepath, temp_zip)
        
        with zipfile.ZipFile(temp_zip, 'r') as zf:
            files = zf.namelist()
            if not files:
                print("⚠️ Archive is empty!")
                return
            
            print(f"\n📦 Contents of {filename}:")
            print("-" * 50)
            for i, name in enumerate(files, 1):
                print(f"  {i}. {name}")
            print("-" * 50)
            print("Type number to open, or filename to extract → press Enter")
            print("Press Ctrl+C to go back\n")
            
            choice = input("→ ").strip()
            
            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(files):
                    selected = files[idx]
                    print(f"📤 Extracting: {selected}")
                    zf.extract(selected, path=os.path.join(REPO_ROOT, "extracted"))
                    extracted_path = os.path.join(REPO_ROOT, "extracted", selected)
                    if os.name == 'nt':
                        os.startfile(extracted_path)
                    print(f"✅ Opened: {selected}")
                else:
                    print("❌ Number not found")
            elif choice in files:
                print(f"📤 Extracting: {choice}")
                zf.extract(choice, path=os.path.join(REPO_ROOT, "extracted"))
                extracted_path = os.path.join(REPO_ROOT, "extracted", choice)
                if os.name == 'nt':
                    os.startfile(extracted_path)
                print(f"✅ Opened: {choice}")
            else:
                print("Skipped — nothing extracted")
                
    except Exception as e:
        print(f"⚠️ Could not read archive: {e}")
    finally:
        if os.path.exists(temp_zip):
            os.remove(temp_zip)

def open_regular_file(filename):
    """Open any normal file"""
    filepath = os.path.join(REPO_ROOT, filename)
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filename}")
        return False
    
    print(f"📂 Opening {filename} ...")
    if os.name == 'nt':
        os.startfile(filepath)
    return True

def main():
    print("=" * 50)
    print("🧭  Daelan's Repo Navigator")
    print("=" * 50)
    print(f"📍 Folder: {REPO_ROOT}")
    print()
    
    try:
        while True:
            list_repo_files()
            print("\nWhat do you want to open?")
            print("• Type filename → open it")
            print("• index.html → opens website")
            print("• .daex / .dae → list contents & extract")
            print("• Ctrl+C → exit\n")
            
            target = input("File: ").strip()
            
            if not target:
                continue
            
            if target in BROWSER_FILES:
                open_browser_file(target)
                continue
            
            ext = os.path.splitext(target)[1].lower()
            if ext in ARCHIVE_EXT:
                handle_archive(target)
                continue
            
            open_regular_file(target)
            
            input("\nPress Enter to continue...")
            print("\n" + "="*50 + "\n")
            
    except KeyboardInterrupt:
        print("\n\n👋 Exited. See you next time!")
        sys.exit(0)

if __name__ == "__main__":
    main()