# Installing SBT on Windows

You have Java 17 installed ✅ - we just need to install SBT.

## Option 1: Download SBT Installer (Recommended - Easiest)

1. **Download the MSI installer**:
   - Go to: https://www.scala-sbt.org/download.html
   - Click on "sbt-1.9.7.msi" (or latest version)
   - Or direct link: https://github.com/sbt/sbt/releases/download/v1.9.7/sbt-1.9.7.msi

2. **Run the installer**:
   - Double-click the downloaded .msi file
   - Follow the installation wizard
   - Accept defaults (will install to C:\Program Files (x86)\sbt\)

3. **Verify installation**:
   - Open a **new** PowerShell window (important - to reload PATH)
   - Run: `sbt --version`
   - You should see: `sbt version 1.9.7`

4. **Return to project and run**:
   ```powershell
   cd "C:\Users\ahmed\Desktop\developer assesment"
   sbt run
   ```

## Option 2: Install Chocolatey First (More Steps)

If you want a package manager for future use:

1. **Install Chocolatey**:
   - Open PowerShell as Administrator
   - Run:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install SBT**:
   ```powershell
   choco install sbt
   ```

3. **Verify**:
   ```powershell
   sbt --version
   ```

## Option 3: Download Portable ZIP

1. **Download**:
   - Go to: https://github.com/sbt/sbt/releases/download/v1.9.7/sbt-1.9.7.zip

2. **Extract**:
   - Extract to: `C:\sbt\`

3. **Add to PATH**:
   - Search for "Environment Variables" in Windows
   - Edit "Path" variable
   - Add: `C:\sbt\bin`
   - Click OK

4. **Restart PowerShell and verify**:
   ```powershell
   sbt --version
   ```

## After Installing SBT

Once SBT is installed, run these commands:

```powershell
# Navigate to project
cd "C:\Users\ahmed\Desktop\developer assesment"

# Compile the project (first time only - downloads dependencies)
sbt compile

# Run the application
sbt run
```

**First compilation will take 3-5 minutes** as it downloads all dependencies (Play Framework, Hibernate, etc.).

Once you see `(Server started, use Enter to stop and go back to the console...)`, open your browser to:

**http://localhost:9000**

The first request will take 30-60 seconds as Play compiles the routes and templates.

## Troubleshooting

**Issue**: "sbt" command not found after installation
- **Solution**: Close and reopen PowerShell (PATH needs to be reloaded)

**Issue**: Installation blocked by antivirus
- **Solution**: Temporarily disable antivirus or add exception for the installer

**Issue**: Permission denied
- **Solution**: Run PowerShell as Administrator

## Quick Check

Current status:
- ✅ Java 17 is installed
- ❌ SBT needs to be installed

**Recommended**: Use Option 1 (MSI Installer) - it's the fastest and most reliable.
