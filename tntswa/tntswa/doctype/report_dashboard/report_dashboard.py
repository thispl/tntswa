# Copyright (c) 2025, TNTSWA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ReportDashboard(Document):
	pass



# import frappe
# import base64
# from frappe.utils.pdf import get_pdf
# from frappe.utils import get_site_path, get_url

# @frappe.whitelist()
# def download_donation_pdf(district=None):

#     conditions = ""
#     values = {}

#     if district:
#         conditions = "AND d.district = %(district)s"
#         values["district"] = district

#     members = frappe.db.sql(f"""
#         SELECT
#             d.membership_id,
#             d.member_name,
#             d.amount,
#             d.district,
#             m.image,
#             m.job_description
#         FROM `tabPayment` d
#         LEFT JOIN `tabMembership Form` m
#             ON m.name = d.membership_id
#         WHERE d.docstatus != 2
#         {conditions}
#         ORDER BY d.member_name
#     """, values, as_dict=True)

#     # ---------- BASE64 WATERMARK IMAGE ----------
#     logo_path = get_site_path("public", "files", "TNTSWA_LOGO1-removebg-preview.png")  # transparent PNG
#     with open(logo_path, "rb") as f:
#         logo_base64 = base64.b64encode(f.read()).decode()

#     html = f"""
#     <html>
#     <head>
#     <style>
#         @page {{
#             size: A4;
#         }}

#         body {{
#             font-family: Arial, sans-serif;
#         }}

#         .page {{
#             position: relative; 
#             page-break-after: always;
#             overflow: hidden;
#         }}


#         /* WATERMARK */
#         .page::before {{
#             content: "";
#             position: absolute;
#             top: -50mm;
#             left: -30mm;
#             right: -30mm;
#             bottom: -50mm;

#             background-image: url("data:image/png;base64,{logo_base64}");
#             background-repeat: no-repeat;
#             background-position: center center;
#             background-size: 65%;
#             opacity: 0.08;

#             z-index: 0;
#         }}

#         .content {{
#             position: relative;
#             z-index: 1;
#             padding: 20mm;
#         }}

#         h3 {{
#             text-align: center;
#             margin-bottom: 5px;
#         }}

#         p {{
#             text-align: center;
#             font-size: 12px;
#             margin-top: 0;
#         }}

#         table {{
#             width: 100%;
#             border-collapse: collapse;
#             margin-top: 15px;
#         }}

#         tr {{
#             page-break-inside: avoid;
#         }}

#         th, td {{
#             border: 1px solid #000;
#             padding: 6px;
#             font-size: 11px;
#         }}

#         th {{
#             background: #f2f2f2;
#         }}

#         img {{
#             border: none;
#             outline: none;
#         }}
#     </style>
#     </head>
#     <body>
#     """

#     # ---------- PAGINATION ----------
#     rows_per_page = 18
#     total = len(members)
#     pages = [members[i:i + rows_per_page] for i in range(0, total, rows_per_page)]

#     sno = 1

#     for page in pages:
#         html += """
#         <div class="page">
#             <div class="content">
#                 <h3>தமிழ்நாடு விழிப்புணர்வு நலச்சங்கம்</h3>
#         """

#         if district:
#             html += f"<p>மாவட்டம் : {district}</p>"
#         else:
#             html += "<p>அனைத்து மாவட்டங்கள்</p>"

#         html += """
#                 <table>
#                     <thead>
#                         <tr>
#                             <th>S.No</th>
#                             <th>Photo</th>
#                             <th>Name</th>
#                             <th>Job Description</th>
#                             <th>Amount</th>
#                         </tr>
#                     </thead>
#                     <tbody>
#         """

#         for m in page:
#             photo = f"<img src='{m.image}' width='45'>" if m.image else "-"
#             html += f"""
#                 <tr>
#                     <td align="center">{sno}</td>
#                     <td align="center">{photo}</td>
#                     <td>{m.member_name}</td>
#                     <td>{m.job_description or '-'}</td>
#                     <td align="right">₹ {m.amount}</td>
#                 </tr>
#             """
#             sno += 1

#         html += """
#                     </tbody>
#                 </table>
#             </div>
#         </div>
#         """

#     html += """
#     </body>
#     </html>
#     """

#     pdf = get_pdf(html, options={
#         "background": True,
#         "images": True,
#         "print-media-type": True,
#         "disable-smart-shrinking": True,
#         "margin-top": "0",
#         "margin-bottom": "0",
#         "margin-left": "0",
#         "margin-right": "0",
#         "enable-local-file-access": True
#     })

#     file = frappe.get_doc({
#         "doctype": "File",
#         "file_name": "Donation_Report.pdf",
#         "content": pdf,
#         "is_private": 0
#     })
#     file.save(ignore_permissions=True)

#     return get_url(file.file_url)


import frappe
import base64
from frappe.utils.pdf import get_pdf
from frappe.utils import get_site_path, get_url
from datetime import datetime

@frappe.whitelist()
def download_donation_pdf(district=None):

    conditions = ""
    values = {}

    if district:
        conditions = "AND d.district = %(district)s"
        values["district"] = district

    members = frappe.db.sql(f"""
        SELECT
            d.membership_id,
            d.member_name,
            d.amount,
            d.district,
            d.posting_date,
            m.image,
            m.job_description,
            d.name_of_non_member
        FROM `tabPayment` d
        LEFT JOIN `tabMembership Form` m
            ON m.name = d.membership_id
        WHERE d.docstatus != 2
        {conditions}
        ORDER BY d.member_name
    """, values, as_dict=True)

    # Extract year for each member
    for m in members:
        if m.posting_date:
            m.payment_year = datetime.strptime(str(m.posting_date), "%Y-%m-%d").year
        else:
            m.payment_year = "-"

    # ---------- BASE64 WATERMARK IMAGE ----------
    logo_path = get_site_path(
        "public", "files", "TNTSWA_LOGO1-removebg-preview.png"
    )
    with open(logo_path, "rb") as f:
        logo_base64 = base64.b64encode(f.read()).decode()

    html = f"""
    <html>
    <head>
    <style>
        @page {{
            size: A4;
            margin: 0;
        }}

        body {{
            font-family: Arial, sans-serif;
            margin: 0;
        }}

        .page {{
            position: relative;
            page-break-after: always;
            width: 210mm;
            height: 247mm;
            overflow: hidden;
        }}

        /* WATERMARK – MOST STABLE METHOD */
        .watermark {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background-image: url("data:image/png;base64,{logo_base64}");
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 65%;
            opacity: 0.08;

            z-index: 0;
        }}

        .content {{
            position: relative;
            z-index: 1;
            padding-left: 20mm;
            padding-right:20mm;
            padding-top:5mm;
        }}

        h3 {{
            text-align: center;
            margin: 0 0 5px 0;
        }}

        p {{
            text-align: center;
            font-size: 12px;
            margin: 0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
        }}

        tr {{
            page-break-inside: avoid;
        }}

        th, td {{
            border: 1px solid #000;
            padding: 6px;
            font-size: 11px;
        }}

        th {{
            background: #FF0000;
            color:white;
        }}

        img {{
            display: block;
            margin: auto;
        }}
    </style>
    </head>
    <body>
    """

    # ---------- PAGINATION ----------
    rows_per_page = 18
    pages = [members[i:i + rows_per_page] for i in range(0, len(members), rows_per_page)]

    sno = 1

    for page in pages:
        html += """
        <div class="page">
            <div class="watermark"></div>
            <div class="content">
            <div>
                <img src="/files/TNTSWA Header.jpeg" alt="TNTSWA Logo" width="700px"><br>
           
        """

        if district:
            html += f"<h4 style=color:white;text-align:center;> {district}</h4></div><br>"
        else: 
            html += f"<h4 style=color:white;text-align:center;> </h4></div>"
        all_years = sorted({m.payment_year for m in members if m.payment_year != "-"})
        all_years_text = ", ".join(str(y) for y in all_years)

        
        html+=f"<h4 style=text-align:center;color:green;>மாநில மையம் வருடந்திர நன்கொடை - {all_years_text}</h4>"

        html += """
                <table>
                    <thead>
                        <tr>
                            <th>வ. எண்</th>
                            <th>புகைப்படம்</th>
                            <th>பெயர்</th>
                            <th>பொறுப்பு</th>
                            <th>நன்கொடை ரூபாய்</th>
                        </tr>
                    </thead>
                    <tbody>
        """

        for m in page:
            photo = f"<img src='{m.image}' width='60'>" if m.image else ""
            html += f"""
                <tr>
                    <td align="center">{sno}</td>
                    <td align="center">{photo}</td>
                    <td>{m.member_name or m.name_of_non_member or ''}</td>
                    <td>{m.job_description or ''}</td>
                    <td align="right">ரூ {m.amount}</td>
                </tr>
            """
            sno += 1

        html += """
                    </tbody>
                </table>
            </div>
        </div>
        """

    html += "</body></html>"

    pdf = get_pdf(
        html,
        options={
            "background": True,
            "images": True,
            "print-media-type": True,
            "disable-smart-shrinking": True,
            "margin-top": "0",
            "margin-bottom": "0",
            "margin-left": "0",
            "margin-right": "0",
            "enable-local-file-access": True
        }
    )

    file = frappe.get_doc({
        "doctype": "File",
        "file_name": "Donation_Report.pdf",
        "content": pdf,
        "is_private": 0
    })
    file.save(ignore_permissions=True)

    return get_url(file.file_url)


