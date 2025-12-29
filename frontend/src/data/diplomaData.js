// All AlNafi Diplomas and Courses Data

// Individual Diploma Components
const cyberSecurityCourses = [
  { id: 1, name: "Linux Deep Dive", hours: 29.25, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 2, name: "Linear Algebra for Emerging Pathways", hours: 9.78, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 3, name: "RHEL Intensive - Linux Fundamentals", hours: 28.47, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 4, name: "RHEL Intensive - Network - User - Administrator", hours: 25.13, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 5, name: "RHEL Intensive - Services", hours: 17, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 6, name: "Python Deep Dive", hours: 43.75, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 7, name: "Learn Data Science Using Python", hours: 20.5, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 8, name: "Certified Information system Security Professional", hours: 32.2, type: "Memorize everything you can repeat this course", diploma: "Cyber Security" },
  { id: 9, name: "AWS Architect Essentials", hours: 1.22, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 10, name: "Cyber Security Essentials Revisit", hours: 5.28, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 11, name: "Elasticsearch SOC Engineer", hours: 5.37, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 12, name: "Probability for Emerging Pathways", hours: 7.62, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 13, name: "Vulnerability Assessment in line with Various frameworks", hours: 16.35, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 14, name: "ISO 27001, ISO 27017, ISO 27018 Lead Implementer & Auditor", hours: 4.72, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 15, name: "PCI DSS Qualified Security Assessor Training", hours: 1.83, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 16, name: "Hacking 101 AKA Ethical Hacking And Incident Response Management", hours: 16.85, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 17, name: "SCADA Prevention & Detection a HOA", hours: 1.45, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 18, name: "SCADA / ICS Security 101", hours: 4.37, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 19, name: "SIEM the HOA Starting the Journey", hours: 1.87, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 20, name: "Statistics for Emerging Pathways", hours: 4.95, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 21, name: "Web Application Pentesting & Ethical Hacking in the line with Various Framework", hours: 3.72, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 22, name: "Elasticsearch Threat Hunting & Observation Engineer", hours: 5.22, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 23, name: "CIS Top 20 Controls Hands on Implementation", hours: 6.2, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 24, name: "Calculus for Emerging Pathways", hours: 4.9, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 25, name: "SCADA, ISO 27019:2017 and NIST 800-82 Connection", hours: 1.9, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 26, name: "Elasticsearch for Data Science and Analytics with Kibana", hours: 2.38, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 27, name: "Network Pentesting, and Ethical Hacking in line Various Frameworks", hours: 5.33, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 28, name: "Real Statistic : A Radical Approch", hours: 0.57, type: "Listen read and move forward", diploma: "Cyber Security" },
  { id: 29, name: "Web Application Pentesting - WSTG", hours: 9.3, type: "Hands on repeat", diploma: "Cyber Security" },
  { id: 30, name: "LinkedIn Course for Job Seekers", hours: 4.03, type: "Keeping doing this Course to maximmize your profile", diploma: "Cyber Security" }
];

const devOpsCourses = [
  { id: 31, name: "DevOps Docker deep Dive", hours: 28.83, type: "Hands on repeat", diploma: "DevOps" },
  { id: 32, name: "Bash Script Deep Dive", hours: 19.3, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 33, name: "Python Automation", hours: 33.88, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 34, name: "Python Selenium", hours: 22.97, type: "Hands on repeat", diploma: "DevOps" },
  { id: 35, name: "JIRA With Python", hours: 11.22, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 36, name: "Python Flask", hours: 11.93, type: "Hands on repeat", diploma: "DevOps" },
  { id: 37, name: "Vagrant", hours: 3.9, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 38, name: "Ansible", hours: 23.08, type: "Hands on repeat", diploma: "DevOps" },
  { id: 39, name: "DevOps Open Source Tools", hours: 13.25, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 40, name: "Team-City (DevOps Open Source Tools)", hours: 2.03, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 41, name: "Test Sigma (DevOps Open Source Tools)", hours: 3.43, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 42, name: "Gradle (DevOps Open Source Tools)", hours: 1.1, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 43, name: "Terraform (DevOps Open Source Tools)", hours: 7.68, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 44, name: "Puppet (DevOps Open Source Tools)", hours: 2.7, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 45, name: "New Relic (DevOps Open Source Tools)", hours: 0.73, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 46, name: "Circleci (DevOps Open Source Tools)", hours: 1.43, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 47, name: "Consul (DevOps Open Source Tools)", hours: 2.3, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 48, name: "Git_github (DevOps Open Source Tools)", hours: 1.77, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 49, name: "Sensu (DevOps Open Source Tools)", hours: 1.4, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 50, name: "Jenkins & Maven (DevOps Open Source Tools)", hours: 1.75, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 51, name: "Nagios (DevOps Open Source Tools)", hours: 4.25, type: "Listen read and move forward", diploma: "DevOps" },
  { id: 52, name: "Kubernetes & Cloud Native Associate (KCNA)", hours: 9.7, type: "Hands on repeat", diploma: "DevOps" },
  { id: 53, name: "Kubernetes Application Developer", hours: 38.57, type: "Hands on repeat", diploma: "DevOps" },
  { id: 54, name: "Kubernetes Administrator", hours: 18.15, type: "Hands on repeat", diploma: "DevOps" },
  { id: 55, name: "Kubernetes Security (CKS)", hours: 2.88, type: "Hands on repeat", diploma: "DevOps" },
  { id: 56, name: "DevOps Cloud Labs (AWS)", hours: 13.15, type: "Hands on repeat", diploma: "DevOps" }
];

const sysOpsCourses = [
  { id: 57, name: "AWS Solution Architect", hours: 43.25, type: "Hands on repeat", diploma: "SysOps" },
  { id: 58, name: "Microsoft Azure Administrator (Architecture)", hours: 10.8, type: "Hands on repeat", diploma: "SysOps" },
  { id: 59, name: "Cloud Security Professional Module", hours: 12.3, type: "Hands on repeat", diploma: "SysOps" },
  { id: 60, name: "Cloud Security Standard Review", hours: 4.3, type: "Hands on repeat", diploma: "SysOps" },
  { id: 61, name: "CISSP-ISSP", hours: 1.43, type: "Hands on repeat", diploma: "SysOps" }
];

const aiCourses = [
  { id: 62, name: "Artificial Intelligence", hours: 17.08, type: "Listen read and move forward", diploma: "AI" },
  { id: 63, name: "Python Progamming for Machine Learning", hours: 8.58, type: "Listen read and move forward", diploma: "AI" },
  { id: 64, name: "Deep Learning", hours: 5.63, type: "Listen read and move forward", diploma: "AI" },
  { id: 65, name: "Machine Learning Mathamatics and Python Implementation", hours: 12.77, type: "Listen read and move forward", diploma: "AI" },
  { id: 66, name: "Advance Topics in Machine Learning", hours: 8.52, type: "Listen read and move forward", diploma: "AI" },
  { id: 67, name: "Deep Learning Deep Dive", hours: 5.43, type: "Listen read and move forward", diploma: "AI" },
  { id: 68, name: "Machine Learning Model Development and Deployment", hours: 10.47, type: "Listen read and move forward", diploma: "AI" },
  { id: 69, name: "Computer Vision", hours: 8.07, type: "Listen read and move forward", diploma: "AI" },
  { id: 70, name: "Natural Language Processing", hours: 3.6, type: "Listen read and move forward", diploma: "AI" },
  { id: 71, name: "Practical Application of Machine Learning", hours: 4.3, type: "Listen read and move forward", diploma: "AI" }
];

// Diploma Configurations
export const diplomasData = {
  "Level 3": {
    name: "Level 3 - Diploma in Cloud Cyber Security",
    level: "Level 3",
    totalHours: 321.51,
    includes: ["Cyber Security"],
    courses: [...cyberSecurityCourses]
  },
  "Level 4": {
    name: "Level 4 - Cyber Security + DevOps & Cloud",
    level: "Level 4",
    totalHours: 602.89, // 321.51 + 281.38
    includes: ["Cyber Security", "DevOps"],
    courses: [...cyberSecurityCourses, ...devOpsCourses]
  },
  "Level 5": {
    name: "Level 5 - Cyber Security + DevOps + SysOps & Cloud",
    level: "Level 5",
    totalHours: 674.97, // 321.51 + 281.38 + 72.08
    includes: ["Cyber Security", "DevOps", "SysOps"],
    courses: [...cyberSecurityCourses, ...devOpsCourses, ...sysOpsCourses]
  },
  "Level 6": {
    name: "Level 6 - AIOps (All Diplomas)",
    level: "Level 6 (AIOps)",
    totalHours: 759.42, // 321.51 + 281.38 + 72.08 + 84.45
    includes: ["Cyber Security", "DevOps", "SysOps", "AI"],
    courses: [...cyberSecurityCourses, ...devOpsCourses, ...sysOpsCourses, ...aiCourses]
  }
};

export const diplomasList = [
  { id: "Level 3", name: "Level 3 - Diploma in Cloud Cyber Security", description: "30 courses • 321.51 hours" },
  { id: "Level 4", name: "Level 4 - Cyber Security + DevOps & Cloud", description: "56 courses • 602.89 hours" },
  { id: "Level 5", name: "Level 5 - Cyber Security + DevOps + SysOps & Cloud", description: "61 courses • 674.97 hours" },
  { id: "Level 6", name: "Level 6 - AIOps (All Diplomas)", description: "71 courses • 759.42 hours" }
];
