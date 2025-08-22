import sys
import importlib
import subprocess
import contextlib
import io

# --------- CONFIG: minimum required versions ----------
MIN_PYTHON = (3, 12, 0)
REQUIRED_PACKAGES = {
    "pygame": "2.6.1",
    "cv2": "4.10.0",
    "numpy": "1.26.4",
    "mediapipe": "0.10.21",
    # standard libraries (no installation needed)
    "random": None,
    "math": None,
    "time": None,
}

# --------- HELPER: compare version strings -----------
def version_ok(current, minimum):
    current_parts = [int(x) for x in current.split(".")]
    min_parts = [int(x) for x in minimum.split(".")]
    return current_parts >= min_parts

# --------- SILENCE unwanted stdout/stderr -----------
@contextlib.contextmanager
def suppress_output():
    new_target = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = new_target, new_target
    try:
        yield
    finally:
        sys.stdout, sys.stderr = old_out, old_err

# --------- 1️⃣ Check Python version -----------------
if sys.version_info < MIN_PYTHON:
    print(f"[ERROR] Python {MIN_PYTHON[0]}.{MIN_PYTHON[1]}.{MIN_PYTHON[2]} or higher is required.")
    print(f"[INFO] Your Python version: {sys.version.split()[0]}")
    sys.exit(1)

print(f"[OK] Python version: {sys.version.split()[0]}")

# --------- 2️⃣ Check required packages --------------
for pkg, min_version in REQUIRED_PACKAGES.items():
    try:
        with suppress_output():  # hide warnings
            module = importlib.import_module(pkg)
        if min_version:  # third-party packages
            current_version = getattr(module, "__version__", getattr(module, "version", "0.0.0"))
            if isinstance(current_version, tuple):
                current_version = ".".join(map(str, current_version))
            if version_ok(current_version, min_version):
                print(f"[OK] {pkg} version: {current_version}")
            else:
                print(f"[WARNING] {pkg} version too old: {current_version}, need >= {min_version}")
        else:  # standard library
            print(f"[OK] {pkg} module is available (built-in)")
    except ImportError:
        if min_version:  # third-party
            print(f"[MISSING] {pkg} is not installed. Installing now...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", f"{pkg}>={min_version}"])
            print(f"[INSTALLED] {pkg} >= {min_version} successfully!")
        else:
            print(f"[ERROR] {pkg} module is missing! This should never happen.")
