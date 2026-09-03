# Cross-Repo Concept Index

A living map of concepts that show up in more than one of the 15 source
repos, built from a full-content survey (2026-07). Purpose: let you (or a
future session) see at a glance where a topic is already covered, in what
format, and where the gaps or inconsistencies are — so new content extends
the collection instead of duplicating it blind.

This is a first pass covering the concepts with the clearest cross-repo
overlap. Extend it as new repos/content get added — don't start a second
file for this.

---

### RAID levels (0 / 1 / 5 / 10)
- **Core-1-Sims** — "RAID Configuration Challenge" (8 scenarios matching
  workload → RAID level + usable-capacity math) and "RAID Troubleshooting
  Challenge"
- **Network-Sims** — RAID Configuration + RAID Troubleshooting sims (oddly
  filed inside the "STP Troubleshooting" folder — just a filing quirk)
- **A-acronym-games.** — `RAID` glossary entry
- Gap: no Network+ or Security+ *quiz* content confirmed testing RAID
  directly — it currently lives only in sims + the A+ glossary.

### Spanning Tree Protocol (STP) / VLANs / switching
- **Network-Sims** — "STP Troubleshooting" lab (VLAN 10/20 config across two
  switches)
- **Network-Acronyms** — `STP` = Spanning Tree Protocol
- **Network-quizzes** — VLAN/trunking/802.1Q/STP/link-aggregation questions
  under the Network Implementation domain
- ⚠️ **Disambiguation needed**: Network-Acronyms also has a *second* `STP` =
  Shielded Twisted Pair (cabling), correctly under a different category. Any
  tool merging acronyms across repos must key on `(acronym, category)`, not
  `acronym` alone.

### Subnetting / CIDR / VLSM / IP addressing
- **Network-Sims** — VLSM/CIDR subnetting exercise sim
- **Network-Acronyms** — `CIDR` and related IP-addressing terms
- **Network-quizzes** — dedicated subnetting/DHCP/DNS/APIPA questions
- **Core-1-quizzes** — has its own dedicated 30-question subnetting quiz
  (called out specifically in that repo's README as a corrected-errors area)

### OSI model / networking fundamentals
- **Network-quizzes** — "Day 1" quiz is explicitly OSI-model-focused (layer
  identification, troubleshooting-by-layer questions)
- **Network-Acronyms** — OSI-adjacent terms under "Networking Fundamentals"
  category
- **Core-1-quizzes** — 2.1 TCP/IP/Ports/Protocols sub-objective overlaps here

### Ports & protocols
- **Port-Quiz** — the canonical source: 26 ports/protocols + 6 insecure→secure
  swap pairs (Telnet→SSH, HTTP→HTTPS, SMTP→SMTPS, POP3→POP3S, IMAP→IMAPS,
  LDAP→LDAPS), explicitly framed as spanning A+/Network+/Security+/CySA+
- **Security-Questions** — has its own smaller embedded ports/protocols quiz
  (`comptia_ports_protocols_exam_mode_quiz.html`) plus a VPN-port question
  (`objectiveId: 1.4`) — overlaps Port-Quiz's content with no cross-reference
- **Network-quizzes** — port/protocol questions folded into the "Ports,
  Protocols, Traffic" objective
- Note: Port-Quiz's own footer and its `data.js` source comment slightly
  disagree on scope (one says "A+ Core 1 port review," the other says
  "A+/Network+/Security+/CySA+ reference") — worth tightening that copy since
  it's the shared cross-cert resource.

### Malware / phishing / incident response
- **Core-2-Sims** — Email Analysis (12-email phishing/legit triage),
  Malware Incident Response (PICERL lifecycle, find/quarantine/kill a
  malicious process across 7 simulated devices)
- **Security-Sims** — Compromised Endpoint Response, Malware Identification
  (behavioral indicators), Infection Analysis PBQ (lateral movement via
  SMB/445, C2 beaconing)
- **CySA-Sims** — Kill Chain staging exercise (phishing → ransomware
  scenario), IOC triage, log correlation for C2/beaconing, SOC analyst
  onboarding scenarios
- **CySA-questions** — dedicated "Malicious Activity & TTP Analysis" (1.3)
  and threat-intel sub-objectives
- This is the richest cross-cert thread in the whole collection — the same
  incident-response narrative (phishing → malware → containment → lessons
  learned) appears at three different depth levels (A+ = basic triage,
  Security+ = technical analysis, CySA+ = full SOC workflow). Good candidate
  for an explicit "learning path" callout if you ever want to sequence
  content for students rather than just list it.

### Identity & access management (AAA, MFA, SSO, RADIUS/TACACS+, Zero Trust)
- **Network-Acronyms** — `ZTA` (Zero Trust Architecture), AAA-adjacent terms
  under "Security Concepts"/"Security Protocols"
- **Security-Acronyms** — full glossary depth: AAA, MFA, SSO, RBAC, PAM
  (x2 meanings), RADIUS-adjacent terms
- **CySA-Acronyms** — SSO, SAML, MFA, PAM, ZTA/ZTNA, plus CASB/SASE (cloud
  identity/access)
- **Security-Questions** — 4.6 IAM objective (28 questions)
- **Windows-Linux-Commands** — practical AAA-adjacent commands (`net user`,
  Group Policy tools) — the hands-on counterpart to the glossary/quiz content
  above

### Encryption / PKI / TLS
- **Security-Acronyms** — AES, RSA, TLS/SSL, PKI, HSM, TPM
- **CySA-Acronyms** — same cluster (PKI, TLS/SSL, RSA, CBC) plus detection
  angle (encrypted-traffic analysis terms)
- **A-acronym-games.** — `TPM` (A+ level, focused on BitLocker/secure boot)
- **Security-Questions** — 1.4 Cryptographic Solutions is the single
  largest objective in that repo (103 of 773 questions) — by far the most
  heavily weighted topic in the whole collection

### Vulnerability management / web app security (OWASP, CVSS, SQLi, XSS)
- **CySA-Sims** — OWASP Top 10 classification + CVSS scoring exercise, web
  server vulnerability assessment (directory traversal, data exposure)
- **CySA-Acronyms** — XSS, CSRF, SSRF, XXE, IDOR, SQLi, SAST/DAST
- **CySA-questions** — 2.0 Vulnerability Management domain (scanning,
  assessment/prioritization, pentest concepts, secure coding)
- **Security-Acronyms** — XSS, XSRF (same cluster, A-level depth)

### Detection & response tooling (SIEM, SOAR, EDR/XDR, IDS/IPS)
- **CySA-Acronyms** — SIEM, SOAR, EDR/XDR, HIDS/NIPS, UEBA
- **CySA-questions** — 1.8/1.9 Security Monitoring & Orchestration
  sub-objectives
- **Network-quizzes** — IDS/IPS/firewalls/DMZ/NAC under Network Security
  domain
- **Network-Sims** / **Security-Sims** — firewall ACL correction PBQs (the
  hands-on counterpart to the IDS/IPS glossary terms)

### Business continuity / disaster recovery (RTO, RPO, MTBF, MTTR, backups)
- **Core-1-quizzes** — MTTR question confirmed directly; backup-type
  questions (full/incremental/differential)
- **CySA-questions** — 3.3 Business Continuity & Disaster Recovery
  sub-objective
- **Security-Questions** — 3.4 Resilience & Recovery objective
- Reliability-metrics terms also appear as their own category in
  Network-Acronyms

### Cloud & virtualization
- **A-acronym-games.** — IaaS/PaaS/SaaS/FaaS/XaaS/VDI (A+ level)
- **Network-Acronyms** — "Cloud & Virtualization" category
- **Security-Questions** — 3.1 Architecture Models (hybrid cloud question
  confirmed at id 600)
- **CySA-Acronyms** — CASB, SASE (cloud-security-specific angle)
- **Core-2-Sims** / **Security-Sims** — VPC Architecture sim (hands-on
  cloud-network design)

### Windows / Linux / PowerShell command-line skills
- **Windows-Linux-Commands** is the sole practical-commands repo (82
  commands: ipconfig, chmod, PowerShell cmdlets, MMC snap-ins) — nothing
  else in the collection covers hands-on CLI the same way. This is a strong
  "Universal" tile fit exactly as placed, and a natural companion to any sim
  that references a CLI (e.g. Network-Sims' fake switch CLI, Core-1-quizzes'
  networking-commands sub-objective).

---

## Known data errors to fix (carried over from CLAUDE.md, tracked here too)

- CySA-Acronyms: `SNI` entry is wrong (defines it as "SMS Notification
  Indicator" with a SOAP-flavored description; should be "Server Name
  Indication," TLS-related).
- Security-Questions README undercounts its own bank (says 514, actual 773).
- Security-Questions' legacy file `100 questions Sec + v3.html` is an
  unfinished stub (6 real questions, rest is a placeholder comment) — safe to
  archive, already fully absorbed into the live bank.
- A-acronym-games.: a few definitions (`DDOS`, `VNC`) read like unedited
  placeholder text.

## How to extend this file

When you survey a new repo or add new content, add a section (or extend an
existing one) here rather than creating a new document. Prioritize noting:
1. Which repos/formats already touch the concept (sim vs. acronym vs. quiz)
2. Any taxonomy mismatch between repos covering the same idea
3. Any factual error found in existing content
 
