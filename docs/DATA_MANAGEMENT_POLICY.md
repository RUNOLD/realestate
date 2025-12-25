# Data Management & Access Control Policy

## 1. Objective
To establish a secure, transparent, and accountable framework for managing employee data within the organization. This policy distinguishes between information that employees can manage autonomously and sensitive data that requires strict administrative oversight to prevent fraud, impersonation, and data breaches.

---

## 2. Low-Risk Data: Employee Self-Service
Staff members are permitted to directly manage "Low-Risk" fields to ensure operational efficiency and internal accountability.

### 2.1 Authorized Fields for Self-Management
*   **Contact Information**: Personal phone numbers, secondary email addresses, and optional residential addresses.
*   **Professional Identity**: Profile pictures and digital avatars.
*   **Security Credentials**: Passwords, login security settings, and multi-factor authentication (MFA) configurations.

### 2.2 Rationale for Self-Service
*   **Operational Efficiency**: Frequent changes in contact details are best handled at the source to prevent communication breakdowns.
*   **Enhanced Security**: Encouraging employees to update passwords and MFA settings independently improves the organization’s overall security posture.
*   **Internal Accountability**: Personalized profiles foster a sense of identity and ownership within the digital workspace.

### 2.3 Management Controls
*   **Notifications**: Automated alerts are sent to the System Administrator whenever a primary contact method or security setting is modified.
*   **Verification**: Changes to primary email addresses may require a verification link sent to the previous address on file.

---

## 3. High-Risk Data: Restricted Administrative Control
Data classified as "High-Risk" is strictly controlled and can only be modified by authorized Administrators or Founders.

### 3.1 Restricted Fields
*   **Legal Identity**: Full Name, Middle Names, and Surnames.
*   **Organizational Role**: Designation, Department, and Job Grade.
*   **Financial Information**: Salary details, bonuses, and bank account/disbursement information.
*   **Access Privileges**: System permissions, API keys, and administrative levels.
*   **Employment Status**: Contract type, tenure, and active/inactive status.

### 3.2 Rationale for Restriction
*   **Fraud Prevention**: Restricting financial and identity data prevents unauthorized redirection of payments (payroll fraud).
*   **Security Integrity**: Preventing unauthorized changes to "Permissions" ensures that the principle of least privilege is maintained.
*   **Audit Reliability**: Maintaining strict control over legal names and roles ensures that the audit trail remains accurate and legally defensible.

---

## 4. Exception & Modification Process
For legitimate changes to High-Risk data (e.g., legal name change due to marriage):
1.  **Submission**: Employee must submit a formal "Data Modification Request" via the internal ticketing system.
2.  **Evidence**: Supporting legal documentation (e.g., marriage certificate, government ID) must be provided.
3.  **Review**: An Administrator must review the evidence and verify the request.
4.  **Manual Update**: The update is performed manually by the Admin, and the change is logged with the reason for the exception.

---

## 5. Role-Based Access Control (RBAC) Framework
Access is governed by the following hierarchy:

| Role | View Rights | Edit Rights | Approval Rights |
| :--- | :--- | :--- | :--- |
| **Staff/Employee** | Own profile | Own low-risk data | N/A |
| **Manager** | Team profiles (limited) | N/A | Leave/Expense requests |
| **Admin/Founder** | All data | High-risk & System data | Payments, Roles, & Permissions |

---

## 6. Audit Trail & Accountability
Every modification to any data field—whether low or high risk—must be meticulously logged. The system will automatically record:
*   **Who**: The unique Identifier of the individual who performed the edit.
*   **What**: The specific original value and the new updated value.
*   **When**: Accurate timestamp (UTC/Local).
*   **Where**: The source IP address and Device Fingerprint.

**Maintaining a 100% accurate audit trail is mandatory for protecting the organization against disputes, claims of missing funds, or regulatory non-compliance.**
