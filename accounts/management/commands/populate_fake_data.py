from datetime import date, timedelta
from decimal import Decimal
import random
from django.core.management.base import BaseCommand
from accounts.models import UserProfile, Organization
from crm.models import Contact, PipelineStage, Lead, Policy, Task, Activity
from boards.models import Board, Column, Card


CONTACTS = [
    ("Marcus", "Holloway",     "m.holloway@vantagegroup.com",    "312-555-0201", "client",   "Referral"),
    ("Diane",  "Kessler",      "dkessler@kesslerlogistics.com",  "312-555-0202", "client",   "Referral"),
    ("Trevor", "Okafor",       "tokafor@okafordev.com",          "773-555-0203", "client",   "LinkedIn"),
    ("Priya",  "Nair",         "p.nair@apexmedical.net",         "312-555-0204", "client",   "Referral"),
    ("Greg",   "Fontaine",     "gfontaine@fontaineconstruct.com","630-555-0205", "client",   "Cold Call"),
    ("Sandra", "Whitfield",    "swhitfield@wfretail.com",        "847-555-0206", "client",   "Referral"),
    ("Kevin",  "Dang",         "kdang@dangtech.io",              "312-555-0207", "client",   "Website"),
    ("Renata", "Vasquez",      "rvasquez@vasquezlaw.com",        "312-555-0208", "client",   "Referral"),
    ("Omar",   "Saleh",        "o.saleh@salebimport.com",        "708-555-0209", "client",   "Trade Show"),
    ("Lydia",  "Carmichael",   "lcarmichael@cmkprops.com",       "847-555-0210", "client",   "Referral"),
    ("Ethan",  "Broussard",    "ebroussard@broussardfab.com",    "312-555-0211", "client",   "Referral"),
    ("Angela", "Morrow",       "amorrow@morrowdental.com",       "773-555-0212", "client",   "Referral"),
    ("Patrick","Drummond",     "pdrummond@drummondinv.com",      "312-555-0213", "client",   "Referral"),
    ("Sofia",  "Lindberg",     "slindberg@nordikdesign.com",     "312-555-0214", "client",   "Website"),
    ("Calvin", "Reese",        "creese@reesemgmt.com",           "630-555-0215", "client",   "Referral"),
    ("Jasmine","Townsend",     "jtownsend@thetownsendgroup.com", "312-555-0216", "prospect", "LinkedIn"),
    ("Bryce",  "Albrecht",     "balbrecht@albrechtauto.com",     "847-555-0217", "prospect", "Cold Call"),
    ("Nadia",  "Osei",         "nosei@oseiclinic.com",           "773-555-0218", "prospect", "Referral"),
    ("Hunter", "Mcallister",   "hmcallister@mcalogistics.com",   "312-555-0219", "prospect", "Trade Show"),
    ("Camille","Bertrand",     "cbertrand@bertrandrestaurants.com","312-555-0220","prospect", "Referral"),
    ("Derek",  "Stanton",      "dstanton@stantonplastics.com",   "708-555-0221", "prospect", "Website"),
    ("Keisha", "Monroe",       "kmonroe@monroehealth.com",       "312-555-0222", "prospect", "LinkedIn"),
    ("Tobias", "Holt",         "tholt@holtwarehousing.com",      "630-555-0223", "prospect", "Cold Call"),
    ("Rachel", "Ingram",       "ringram@ingramarchitects.com",   "312-555-0224", "prospect", "Referral"),
    ("Felix",  "Nguyen",       "fnguyen@nguyenfoods.com",        "773-555-0225", "prospect", "Trade Show"),
    ("Lorena", "Castillo",     "lcastillo@castilloelectric.com", "312-555-0226", "prospect", "Referral"),
    ("Aaron",  "Fitch",        "afitch@fitchmedia.com",          "847-555-0227", "lead",     "Website"),
    ("Mei",    "Zhang",        "mzhang@zhangimports.com",        "312-555-0228", "lead",     "LinkedIn"),
    ("Isaiah", "Norris",       "inorris@norriscleaning.com",     "708-555-0229", "lead",     "Cold Call"),
    ("Bianca", "Ferreira",     "bferreira@ferreiralaw.com",      "312-555-0230", "lead",     "Referral"),
    ("Cole",   "Sutherland",   "csutherland@sutherlandcap.com",  "312-555-0231", "lead",     "LinkedIn"),
    ("Tanya",  "Obrien",       "tobrien@obrienroofing.com",      "773-555-0232", "lead",     "Cold Call"),
    ("Marcus", "Patel",        "mpatel@pateltechnology.com",     "312-555-0233", "lead",     "Website"),
    ("Grace",  "Yoon",         "gyoon@yoonpharma.com",           "312-555-0234", "lead",     "Trade Show"),
    ("Darnell","Washington",   "dwashington@washingtonfleet.com","708-555-0235", "lead",     "Referral"),
    ("Iris",   "Kowalski",     "ikowalski@kowalskitech.com",     "847-555-0236", "lead",     "Website"),
    ("Theo",   "Mckenzie",     "tmckenzie@mckenzieevents.com",   "312-555-0237", "lead",     "LinkedIn"),
    ("Vanessa","Dupont",       "vdupont@dupontrealty.com",       "312-555-0238", "lead",     "Referral"),
    ("Caleb",  "Cross",        "ccross@crossbrewing.com",        "773-555-0239", "lead",     "Trade Show"),
    ("Nina",   "Harmon",       "nharmon@harmonhospitality.com",  "312-555-0240", "lead",     "Website"),
]

PIPELINE_STAGES = [
    ("New Lead",    "#6366f1"),
    ("Contacted",   "#8b5cf6"),
    ("Quote Sent",  "#ec4899"),
    ("Negotiating", "#f59e0b"),
    ("Won",         "#22c55e"),
]

CARRIERS = [
    "Travelers", "Chubb", "Hartford", "Cincinnati Financial",
    "Markel", "Zurich", "CNA", "Nationwide", "Liberty Mutual", "Berkley One",
]

POLICIES = [
    ("commercial", 18400, 2760),
    ("commercial", 24800, 3720),
    ("commercial", 31200, 4680),
    ("commercial",  9600, 1440),
    ("commercial", 14500, 2175),
    ("home",        3200,  480),
    ("home",        4100,  615),
    ("home",        2800,  420),
    ("auto",        2600,  390),
    ("auto",        3900,  585),
    ("auto",        1800,  270),
    ("life",       12000, 1800),
    ("life",        8500, 1275),
    ("life",        6200,  930),
    ("health",      5800,  870),
    ("health",      9200, 1380),
]

CLIENT_POLICY_MAP = {
    "Marcus Holloway":   [("commercial",28400,4260), ("commercial",14200,2130), ("auto",3200,480)],
    "Diane Kessler":     [("commercial",42000,6300), ("commercial",18600,2790)],
    "Trevor Okafor":     [("commercial",19800,2970), ("home",4200,630), ("auto",2800,420)],
    "Priya Nair":        [("health",12400,1860), ("health",8600,1290), ("life",15000,2250)],
    "Greg Fontaine":     [("commercial",55000,8250), ("commercial",22000,3300), ("auto",4600,690)],
    "Sandra Whitfield":  [("commercial",31500,4725), ("home",3800,570)],
    "Kevin Dang":        [("commercial",16200,2430), ("life",9800,1470), ("auto",2400,360)],
    "Renata Vasquez":    [("commercial",24000,3600), ("life",18000,2700)],
    "Omar Saleh":        [("commercial",38000,5700), ("commercial",20000,3000), ("auto",5200,780)],
    "Lydia Carmichael":  [("commercial",29000,4350), ("home",6200,930)],
    "Ethan Broussard":   [("commercial",47000,7050), ("commercial",23000,3450)],
    "Angela Morrow":     [("health",14500,2175), ("life",22000,3300), ("home",4800,720)],
    "Patrick Drummond":  [("commercial",62000,9300), ("life",30000,4500)],
    "Sofia Lindberg":    [("commercial",18000,2700), ("home",5100,765), ("auto",3100,465)],
    "Calvin Reese":      [("commercial",33000,4950), ("commercial",15000,2250), ("auto",2900,435)],
}

TASKS = [
    ("Call Greg Fontaine — construction renewal review",      "high",   -1,  False),
    ("Send commercial package quote to Jasmine Townsend",     "high",    0,  False),
    ("Follow up: Bryce Albrecht auto dealership fleet",       "high",    1,  False),
    ("Prepare loss run report for Patrick Drummond",          "high",    1,  False),
    ("Email renewal docs to Ethan Broussard",                 "high",    2,  False),
    ("Schedule site inspection — Fontaine Construction",      "medium",  2,  False),
    ("Review Travelers binder for Omar Saleh import",         "high",    3,  False),
    ("Confirm policy bind with Renata Vasquez",               "medium",  3,  False),
    ("Send umbrella quote to Diane Kessler",                  "high",    4,  False),
    ("Update D&O coverage details — Drummond Investments",    "medium",  5,  False),
    ("Nadia Osei clinic — BOP quote due",                     "high",    5,  False),
    ("Submit endorsement change — Sandra Whitfield",          "medium",  6,  False),
    ("Check Chubb renewal pricing for Lydia Carmichael",      "high",    6,  False),
    ("Follow up Hunter Mcallister logistics quote",           "medium",  7,  False),
    ("Send life insurance proposal — Camille Bertrand",       "medium",  7,  False),
    ("Update fleet schedule — Omar Saleh",                    "low",     8,  False),
    ("Annual review meeting — Marcus Holloway",               "high",    9,  False),
    ("Process cancellation endorsement — inactive policy",    "low",    10,  True),
    ("Obtain MVRs for Bryce Albrecht auto fleet",             "medium", 11,  False),
    ("Call Derek Stanton — plastics manufacturer BOP",        "high",   12,  False),
    ("Send Hartford quote to Keisha Monroe",                  "medium", 12,  False),
    ("Request financials from Tobias Holt warehouse",         "medium", 14,  False),
    ("Schedule Rachel Ingram onboarding call",                "low",    14,  True),
    ("Follow up Felix Nguyen food distributor",               "medium", 15,  False),
    ("Review Zurich renewal terms — Calvin Reese",            "high",   -3,  False),
    ("Overdue: bind Lorena Castillo electrical contractor",   "high",   -2,  False),
    ("Overdue: renewal docs to Kevin Dang",                   "high",   -2,  False),
    ("Send certificate of insurance — Angela Morrow",         "medium",  1,  False),
    ("Quote cyber liability for Sofia Lindberg",              "medium",  4,  False),
    ("Board presentation prep — Q1 results",                  "low",    18,  True),
]

ACTIVITIES = [
    ("Marcus Holloway",   "call",    "Reviewed all 3 policies. Client confirmed renewal on commercial and auto. Flagged umbrella gap — scheduling follow-up quote."),
    ("Marcus Holloway",   "email",   "Sent updated commercial renewal proposal with Travelers pricing. Awaiting signature."),
    ("Diane Kessler",     "meeting", "In-person meeting at logistics HQ. Walked through fleet exposure and warehouse property values. Agreed to increase commercial limit to $5M."),
    ("Diane Kessler",     "call",    "Confirmed Chubb binder received. Invoice to be sent end of week."),
    ("Diane Kessler",     "email",   "Sent umbrella endorsement quote — $1.2M additional premium."),
    ("Greg Fontaine",     "meeting", "Annual review. 4 active job sites, new equipment schedule added. Requested inland marine quote by Friday."),
    ("Greg Fontaine",     "call",    "Greg flagged a subcontractor injury incident — referred to claims team. Reminded about OSHA compliance docs."),
    ("Greg Fontaine",     "email",   "Sent revised certificate of insurance for city permit application."),
    ("Priya Nair",        "call",    "Discussed expanding health plan to new hires (7 additional). Sent updated census to carrier."),
    ("Priya Nair",        "email",   "Hartford group health renewal — forwarded comparison to Dr. Nair. Rates up 9.2%."),
    ("Omar Saleh",        "meeting", "Reviewed import cargo policy. Client expanding to Southeast Asia routes — updating ocean cargo limit."),
    ("Omar Saleh",        "call",    "Claims update: container damage claim settled at $38k. Carrier satisfied. Renewal on track."),
    ("Omar Saleh",        "email",   "Sent new ocean cargo floater quote — Zurich at $4,800 annual."),
    ("Ethan Broussard",   "call",    "Fabrication shop added new CNC equipment worth $340k. Updating equipment breakdown coverage."),
    ("Ethan Broussard",   "email",   "Sent updated commercial property endorsement. Bound as of today."),
    ("Patrick Drummond",  "meeting", "Quarterly review — investment fund added two new LPs. D&O limit increased to $10M. Markel binding next week."),
    ("Patrick Drummond",  "call",    "Client concerned about cyber coverage gap. Scheduled dedicated cyber liability presentation for Friday."),
    ("Patrick Drummond",  "email",   "Sent Chubb cyber quote — $62k premium for $5M limit. Awaiting approval."),
    ("Renata Vasquez",    "call",    "Discussed employment practices liability for the firm. Sent EPLI proposal."),
    ("Renata Vasquez",    "email",   "Bound commercial package. Certificates sent to opposing counsel per client request."),
    ("Angela Morrow",     "meeting", "Benefits review. Dental and vision added for 12 employees. Life insurance updated to $500k each."),
    ("Angela Morrow",     "call",    "Discussed short-term disability gap. Referred to group benefits specialist."),
    ("Calvin Reese",      "call",    "Lease renewal requires $5M GL limit — requested endorsement from Zurich. Expedited."),
    ("Calvin Reese",      "email",   "Sent updated COI for new property management agreement."),
    ("Jasmine Townsend",  "call",    "First contact call. Commercial real estate portfolio — 6 properties. Very interested in commercial package. Sending quote Monday."),
    ("Jasmine Townsend",  "email",   "Sent intro email and risk profile questionnaire. She responded same day — hot lead."),
    ("Bryce Albrecht",    "call",    "Albrecht Auto — 40-car dealer lot. Current carrier is non-renewing. Urgent quote needed by end of month."),
    ("Bryce Albrecht",    "note",    "Pulled loss runs: 2 minor claims in 3 years. Good risk. Targeting Travelers and CNA for dealer program."),
    ("Nadia Osei",        "call",    "Osei Medical Clinic — BOP + professional liability. 3 locations. Revenue ~$4.2M. Very promising account."),
    ("Nadia Osei",        "email",   "Sent risk questionnaire and requested 3 years of loss runs. Meeting scheduled for Thursday."),
    ("Hunter Mcallister", "meeting", "Logistics fleet — 28 trucks. Current premium $180k/yr. We quoted at $154k. Moving forward pending board approval."),
    ("Hunter Mcallister", "call",    "Follow-up call after meeting. Hunter said their CFO is reviewing our proposal this week."),
    ("Derek Stanton",     "call",    "Cold call converted to appointment. Plastics manufacturer, $8M revenue. No broker currently — wide open."),
    ("Camille Bertrand",  "email",   "Sent restaurant group BOP proposal for 3 locations. Followed up on life insurance for the two partners."),
    ("Keisha Monroe",     "call",    "Monroe Health — group medical + professional liability. Active negotiation on Hartford quote."),
    ("Felix Nguyen",      "call",    "Food distribution company — product liability exposure. Requested spoilage coverage add-on. Big account potential."),
    ("Lorena Castillo",   "email",   "Castillo Electric — contractor BOP. Quote approved by client. Waiting on signed application to bind."),
    ("Lydia Carmichael",  "call",    "Annual review. Property values updated. Added new retail location to schedule. COI sent to landlord."),
    ("Sandra Whitfield",  "email",   "Retail chain — sent updated property schedule with replacement cost values. 4 locations confirmed."),
    ("Sofia Lindberg",    "call",    "Discussed cyber liability for design firm. Client storing sensitive client IP — strong need. Sending CNA quote."),
]

BOARD_DATA = [
    {
        "name": "New Business Pipeline",
        "description": "Track all new account opportunities from prospect to bound",
        "columns": [
            ("Prospecting",    "#6366f1", [
                ("Mei Zhang — import/export BOP",         "Warm intro from Diane Kessler. $90k+ commercial potential.",         14),
                ("Caleb Cross — craft brewery",           "Trade show lead. Product liability + property. Quote next week.",     10),
                ("Nina Harmon — hospitality group",       "4 properties. Interested in full commercial package.",               9),
                ("Darnell Washington — fleet account",    "50-unit fleet. Pulled loss runs. Preparing quote.",                  7),
                ("Theo Mckenzie — event production",      "Event liability + equipment. High-value short-term policies.",       6),
            ]),
            ("Quote Sent",     "#f59e0b", [
                ("Jasmine Townsend — 6-property portfolio","$280k commercial package quote sent Monday. Awaiting response.",    5),
                ("Bryce Albrecht — auto dealer lot",      "Dealer open lot + garage keepers. CNA and Travelers quotes sent.",   4),
                ("Nadia Osei — medical clinic (3 sites)", "BOP + professional liability. $38k total premium proposal.",        3),
                ("Camille Bertrand — restaurant group",   "3-location BOP + life insurance for 2 partners.",                   2),
                ("Derek Stanton — plastics manufacturer", "Travelers commercial package. $42k estimate. Follow up Friday.",    2),
            ]),
            ("Negotiating",    "#ec4899", [
                ("Hunter Mcallister — 28-truck fleet",    "We beat incumbent by $26k. CFO review this week. Almost there.",    1),
                ("Keisha Monroe — health group benefits", "Hartford group health + EPL. Back-and-forth on deductibles.",       3),
                ("Tobias Holt — warehouse & storage",     "Markel inland marine quote. Client wants higher sublimit. Revising.",2),
            ]),
            ("Won — Pending Bind", "#22c55e", [
                ("Lorena Castillo — electrical contractor","Signed app received. Binding today.",                              1),
                ("Felix Nguyen — food distributor",       "Product liability + cargo bound. Certs to be issued by EOD.",       1),
            ]),
        ],
    },
    {
        "name": "Q1 Renewals",
        "description": "All policies renewing in Q1 — priority retention and upsell tracking",
        "columns": [
            ("To Review",   "#6366f1", [
                ("Ethan Broussard — commercial pkg renewal",   "Due in 28 days. Equipment values need update.",       14),
                ("Sandra Whitfield — retail property",         "4 locations. Travelers renewal. Check replacement cost.", 12),
                ("Kevin Dang — tech E&O renewal",              "Due in 21 days. Revenue up 40% — exposure change.",   10),
                ("Sofia Lindberg — commercial package",        "Add cyber liability this cycle.",                      9),
            ]),
            ("Quote Requested", "#f59e0b", [
                ("Greg Fontaine — construction BOP",           "Inland marine needed. Hartford and Zurich quoted.",    7),
                ("Calvin Reese — property management",         "Limit increase to $5M GL required by lease.",          6),
                ("Lydia Carmichael — commercial & property",   "Added new retail location to schedule.",               5),
            ]),
            ("Renewal Bound",   "#22c55e", [
                ("Marcus Holloway — full commercial account",  "Bound Travelers. COI sent.",                          0),
                ("Omar Saleh — cargo & commercial",            "Zurich renewal + ocean cargo floater bound.",          0),
                ("Renata Vasquez — law firm package",          "Bound EPLI + commercial. Certificates issued.",        0),
                ("Angela Morrow — group benefits",             "Hartford group renewal + dental/vision added.",        0),
            ]),
        ],
    },
    {
        "name": "Client Onboarding",
        "description": "New clients — ensure smooth handoff from sales to service",
        "columns": [
            ("Welcome & Docs",  "#6366f1", [
                ("Lorena Castillo",  "Send welcome packet. Collect signed ACORD forms.",   3),
                ("Felix Nguyen",     "Issue certs of insurance. Intro to service team.",   2),
            ]),
            ("Coverage Review",  "#8b5cf6", [
                ("Keisha Monroe",    "Review all coverages with client. Confirm contacts.", 5),
                ("Hunter Mcallister","Walk through fleet schedule and COI distribution.",   4),
            ]),
            ("Active Client",    "#22c55e", [
                ("Jasmine Townsend", "Add to renewal calendar. Assign account manager.",   7),
                ("Bryce Albrecht",   "All certs issued. Intro call completed.",            0),
            ]),
        ],
    },
    {
        "name": "Team Operations",
        "description": "Internal agency tasks and process management",
        "columns": [
            ("Backlog",     "#6366f1", [
                ("Update carrier appointment with CNA",       "New commercial lines authority needed.",               30),
                ("Revise agency E&O policy schedule",         "Annual review — submit to Markel by end of month.",    14),
                ("Set up automated renewal reminder workflow","Use CRM tasks for 90/60/30-day alerts.",              21),
                ("Update agency website testimonials",        "5 new client testimonials to publish.",               20),
            ]),
            ("In Progress", "#f59e0b", [
                ("Q1 book-of-business revenue report",        "Pull all premiums and commissions for board review.",   5),
                ("Hire second account manager",               "3 candidates shortlisted. Final interviews this week.", 7),
                ("Carrier training — Chubb cyber products",   "Webinar Thursday 2PM.",                                2),
            ]),
            ("Done",        "#22c55e", [
                ("Renew agency license — Illinois DOI",       "Completed. Valid through 2027.",                       0),
                ("Implement CRM data cleanup",                "All duplicate contacts merged.",                       0),
                ("Q4 carrier performance review",             "Completed and shared with producers.",                 0),
            ]),
        ],
    },
]


class Command(BaseCommand):
    help = "Populate account with realistic high-volume business data for a given email"

    def add_arguments(self, parser):
        parser.add_argument("email", type=str)
        parser.add_argument("--clear", action="store_true", help="Clear existing data before populating")

    def handle(self, *args, **options):
        email = options["email"]
        try:
            profile = UserProfile.objects.select_related("organization").get(email=email)
        except UserProfile.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"No user found with email: {email}"))
            return
        org = profile.organization

        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            org.activities.all().delete()
            org.tasks.all().delete()
            org.leads.all().delete()
            org.policies.all().delete()
            org.contacts.all().delete()
            org.pipeline_stages.all().delete()
            for board in org.boards.all():
                board.delete()

        self.stdout.write(f"Populating data for {profile.name or email} ({org.name})...")

        stages = self._create_stages(org)
        contacts = self._create_contacts(org, profile)
        self._create_leads(org, contacts, stages)
        self._create_policies(org, contacts)
        self._create_tasks(org, profile, contacts)
        self._create_activities(org, profile, contacts)
        self._create_boards(org, profile)

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {len(contacts)} contacts, policies, leads, tasks, activities, and 4 boards."
        ))

    def _create_stages(self, org):
        stages = []
        for i, (name, color) in enumerate(PIPELINE_STAGES):
            s, _ = PipelineStage.objects.get_or_create(
                organization=org, name=name,
                defaults={"order": i, "color": color},
            )
            stages.append(s)
        return stages

    def _create_contacts(self, org, profile):
        contact_map = {}
        for first, last, email, phone, status, source in CONTACTS:
            c = Contact.objects.create(
                organization=org,
                first_name=first,
                last_name=last,
                email=email,
                phone=phone,
                status=status,
                source=source,
                assigned_agent=profile,
            )
            contact_map[f"{first} {last}"] = c
        return contact_map

    def _create_leads(self, org, contact_map, stages):
        stage_map = {s.name: s for s in stages}
        lead_specs = [
            ("Jasmine Townsend",  "New Lead",    280000, 40, 10,  "6-property commercial portfolio. Hot lead — sent quote Monday."),
            ("Bryce Albrecht",    "Quote Sent",   95000, 60,  7,  "Auto dealer lot — non-renewal from current carrier. Urgent."),
            ("Nadia Osei",        "Quote Sent",   38000, 65,  5,  "Medical clinic BOP + professional liability. 3 locations."),
            ("Hunter Mcallister", "Negotiating",  154000, 80, 3,  "28-truck fleet. Beat incumbent by $26k. CFO sign-off pending."),
            ("Keisha Monroe",     "Negotiating",  62000, 75,  4,  "Group health + EPL. Back-and-forth on deductibles."),
            ("Tobias Holt",       "Quote Sent",   48000, 55,  6,  "Warehouse & storage. Inland marine sublimit revision needed."),
            ("Derek Stanton",     "Contacted",    42000, 45, 12,  "Plastics manufacturer. Travelers quote $42k. Follow up Friday."),
            ("Camille Bertrand",  "Quote Sent",   29000, 60,  3,  "3-location restaurant BOP + partner life insurance."),
            ("Rachel Ingram",     "Contacted",    18000, 30, 18,  "Architecture firm. E&O + commercial package. Early stages."),
            ("Felix Nguyen",      "Won",          31000, 100, 0,  "Food distributor bound. Product liability + cargo. Done."),
            ("Lorena Castillo",   "Won",          14500, 100, 0,  "Electrical contractor BOP bound. Binding today."),
            ("Aaron Fitch",       "New Lead",     22000, 20, 21,  "Media production company. Short-term event policies potential."),
            ("Mei Zhang",         "New Lead",     90000, 25, 14,  "Import/export business. Warm referral from Kessler."),
            ("Caleb Cross",       "New Lead",     18000, 20, 10,  "Craft brewery — product liability + property. Trade show lead."),
            ("Darnell Washington","Contacted",    85000, 35,  7,  "50-unit fleet. Loss runs pulled. Quote in progress."),
            ("Cole Sutherland",   "New Lead",    120000, 15, 30,  "Investment firm — D&O + E&O. Large account potential."),
            ("Theo Mckenzie",     "New Lead",     24000, 20, 14,  "Event production — event liability + equipment floater."),
            ("Vanessa Dupont",    "Contacted",    55000, 40,  9,  "Real estate brokerage — E&O + commercial property. Active."),
            ("Grace Yoon",        "New Lead",     78000, 20, 21,  "Pharma distribution — product liability. Huge exposure."),
            ("Nina Harmon",       "Contacted",    95000, 30,  9,  "4-property hospitality group. Full commercial package."),
        ]
        for name, stage_name, value, prob, days_out, notes in lead_specs:
            c = contact_map.get(name)
            if not c:
                continue
            stage = stage_map.get(stage_name)
            Lead.objects.create(
                organization=org,
                contact=c,
                stage=stage,
                value=Decimal(value),
                probability=prob,
                expected_close=date.today() + timedelta(days=days_out),
                notes=notes,
            )

    def _create_policies(self, org, contact_map):
        for full_name, specs in CLIENT_POLICY_MAP.items():
            c = contact_map.get(full_name)
            if not c:
                continue
            for ptype, premium, commission in specs:
                eff = date.today() - timedelta(days=random.randint(30, 300))
                carrier = random.choice(CARRIERS)
                pol_num = f"POL-{random.randint(100000, 999999)}"
                Policy.objects.create(
                    organization=org,
                    contact=c,
                    policy_number=pol_num,
                    carrier=carrier,
                    type=ptype,
                    premium=Decimal(premium),
                    commission=Decimal(commission),
                    status=random.choice(["active", "active", "active", "bound"]),
                    effective_date=eff,
                    expiry_date=eff + timedelta(days=365),
                )

    def _create_tasks(self, org, profile, contact_map):
        contact_list = list(contact_map.values())
        for i, (title, priority, day_offset, completed) in enumerate(TASKS):
            related = contact_list[i % len(contact_list)]
            Task.objects.create(
                organization=org,
                assigned_to=profile,
                related_contact=related,
                title=title,
                description="",
                due_date=date.today() + timedelta(days=day_offset),
                priority=priority,
                completed=completed,
            )

    def _create_activities(self, org, profile, contact_map):
        for contact_name, atype, description in ACTIVITIES:
            c = contact_map.get(contact_name)
            if not c:
                continue
            Activity.objects.create(
                organization=org,
                contact=c,
                user=profile,
                type=atype,
                description=description,
            )

    def _create_boards(self, org, profile):
        for bd in BOARD_DATA:
            board = Board.objects.create(
                organization=org,
                name=bd["name"],
                description=bd["description"],
                created_by=profile,
            )
            for col_order, (col_name, col_color, cards) in enumerate(bd["columns"]):
                col = Column.objects.create(
                    board=board, name=col_name, order=col_order, color=col_color,
                )
                for card_order, card_data in enumerate(cards):
                    title = card_data[0]
                    desc = card_data[1] if len(card_data) > 1 else ""
                    days_out = card_data[2] if len(card_data) > 2 else 7
                    Card.objects.create(
                        column=col,
                        title=title,
                        description=desc,
                        assigned_to=profile,
                        order=card_order,
                        due_date=date.today() + timedelta(days=days_out),
                    )
