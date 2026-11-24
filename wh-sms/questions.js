window.WHSMS_PREVIEW_QUESTIONS = {
  "sponsor": {
    "title": "Sponsor pathway",
    "intro": "Kia ora! A few short questions will help the Wolfgramm Holdings team understand how you would like to support Visibility Labs.",
    "questions": [
      {
        "id": "sponsor-objective",
        "prompt": "What would you most like to achieve through supporting Visibility Labs?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "support-local-businesses",
            "label": "Support local businesses"
          },
          {
            "id": "community-impact",
            "label": "Build community impact"
          },
          {
            "id": "brand-visibility",
            "label": "Increase brand visibility"
          },
          {
            "id": "support-entrepreneurs",
            "label": "Support entrepreneurs"
          },
          {
            "id": "explore-partnership",
            "label": "Explore partnership opportunities"
          },
          {
            "id": "other",
            "label": "Something else"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "sponsor-involvement",
        "prompt": "How would you ideally like to be involved?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "sponsor-participant-places",
            "label": "Sponsor participant places"
          },
          {
            "id": "support-event",
            "label": "Support an event"
          },
          {
            "id": "provide-expertise-services",
            "label": "Provide expertise or services"
          },
          {
            "id": "strategic-partnership",
            "label": "Strategic partnership"
          },
          {
            "id": "not-sure",
            "label": "Not sure yet"
          },
          {
            "id": "other",
            "label": "Other"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "sponsor-focus",
        "prompt": "Is there a particular type of business, community or outcome you are most interested in supporting?",
        "type": "text",
        "required": true,
        "choices": [],
        "maxLength": 2000,
        "multiline": true
      },
      {
        "id": "sponsor-readiness",
        "prompt": "Where are you currently at in exploring this opportunity?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "ready-to-discuss",
            "label": "Ready to discuss"
          },
          {
            "id": "exploring",
            "label": "Exploring possibilities"
          },
          {
            "id": "need-more-information",
            "label": "Need more information"
          },
          {
            "id": "planning-for-later",
            "label": "Planning for later"
          },
          {
            "id": "not-sure",
            "label": "Not sure yet"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      }
    ]
  },
  "cyber-resilience": {
    "title": "Cyber Resilience pathway",
    "intro": "",
    "questions": [
      {
        "id": "cyber-business-risk",
        "prompt": "If your business systems went down tomorrow, what would concern you most?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "losing-sales-income",
            "label": "Losing sales or income"
          },
          {
            "id": "losing-customer-information",
            "label": "Losing customer information"
          },
          {
            "id": "disrupting-daily-operations",
            "label": "Disrupting daily operations"
          },
          {
            "id": "damaging-customer-trust",
            "label": "Damaging customer trust"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-disruption-impact",
        "prompt": "If your business systems went down, how much would it affect your day-to-day business?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "major-disruption",
            "label": "A major disruption"
          },
          {
            "id": "some-disruption",
            "label": "Some disruption"
          },
          {
            "id": "very-little-disruption",
            "label": "Very little disruption"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-login-security",
        "prompt": "Do you have an extra security step when signing in to important business accounts, like your email or banking?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "all-important-accounts",
            "label": "Yes, on all important accounts"
          },
          {
            "id": "some-accounts",
            "label": "Yes, but only on some accounts"
          },
          {
            "id": "no-extra-step",
            "label": "No, not at the moment"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-backup-recovery",
        "prompt": "If you lost your important business files tomorrow, could you get them back?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "tested-backups",
            "label": "Yes, we’ve tested our backups"
          },
          {
            "id": "untested-backups",
            "label": "We have backups, but haven’t tested them"
          },
          {
            "id": "no-backups",
            "label": "No, we don’t have backups"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-system-updates",
        "prompt": "Are your business computers, phones and software regularly updated to keep them secure?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "regularly-updated",
            "label": "Yes, they’re updated regularly"
          },
          {
            "id": "partially-updated",
            "label": "Some are, but not everything"
          },
          {
            "id": "not-regularly-updated",
            "label": "No, we don’t regularly update them"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-access-removal",
        "prompt": "When someone leaves your business, can you quickly remove their access to your systems and customer information?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "clear-process",
            "label": "Yes, we have a process"
          },
          {
            "id": "inconsistent-process",
            "label": "Usually, but it’s not always consistent"
          },
          {
            "id": "no-process",
            "label": "No, we don’t have a process"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-staff-awareness",
        "prompt": "Would your team know how to spot and report a suspicious email, message or payment request?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "team-trained",
            "label": "Yes, our team is trained"
          },
          {
            "id": "some-trained",
            "label": "Some would, but not everyone"
          },
          {
            "id": "probably-not",
            "label": "Probably not"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "cyber-incident-response",
        "prompt": "If your business experienced a cyberattack tomorrow, would you and your team know what to do first?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "clear-plan",
            "label": "Yes, we have a clear plan"
          },
          {
            "id": "some-idea-no-formal-plan",
            "label": "We have some idea, but no formal plan"
          },
          {
            "id": "unsure-what-to-do",
            "label": "No, we’d probably be unsure what to do"
          },
          {
            "id": "not-sure",
            "label": "I’m not sure"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      }
    ]
  },
  "business-systems": {
    "title": "Business Systems pathway",
    "intro": "",
    "questions": [
      {
        "id": "business-pain-point",
        "prompt": "What’s taking up more time than it should in your business?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "chasing-information-updates",
            "label": "Chasing information and updates"
          },
          {
            "id": "managing-staff-tasks-paperwork",
            "label": "Managing staff tasks and paperwork"
          },
          {
            "id": "keeping-customers-informed",
            "label": "Keeping customers informed"
          },
          {
            "id": "bit-of-everything",
            "label": "A bit of everything"
          },
          {
            "id": "something-else",
            "label": "Something else"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "business-desired-improvement",
        "prompt": "If you could make one thing easier in your business tomorrow, what would it be?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "one-simple-dashboard",
            "label": "See everything in one simple dashboard"
          },
          {
            "id": "less-paperwork-admin",
            "label": "Spend less time on paperwork and admin"
          },
          {
            "id": "easier-for-customers",
            "label": "Make things easier for my customers"
          },
          {
            "id": "staff-work-together",
            "label": "Help my staff work better together"
          },
          {
            "id": "not-quite-sure-yet",
            "label": "I’m not quite sure yet"
          },
          {
            "id": "something-else",
            "label": "Something else"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "business-who-benefits",
        "prompt": "Who would benefit most from having your everyday business tasks better organised?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "business-owner",
            "label": "Me, as the business owner"
          },
          {
            "id": "managers-and-staff",
            "label": "Our managers and staff"
          },
          {
            "id": "customers-or-clients",
            "label": "Our customers or clients"
          },
          {
            "id": "everyone-different-access",
            "label": "Everyone, but with different access"
          },
          {
            "id": "not-sure-yet",
            "label": "I’m not sure yet"
          },
          {
            "id": "someone-else",
            "label": "Someone else"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "business-access-comfort",
        "prompt": "How would you feel about an outside provider having access to parts of your business systems?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "specific-areas-i-approve",
            "label": "I’d only allow access to specific areas I approve"
          },
          {
            "id": "demonstration-first",
            "label": "I’d prefer to see a demonstration first"
          },
          {
            "id": "understand-protection-first",
            "label": "I’d need to understand how my business information would be protected"
          },
          {
            "id": "comfortable-discussing-access",
            "label": "I’m comfortable discussing what access might be needed"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      },
      {
        "id": "business-next-step",
        "prompt": "What would you feel most comfortable doing next?",
        "type": "choice",
        "required": true,
        "choices": [
          {
            "id": "see-demonstration",
            "label": "I’d like to see a demonstration first"
          },
          {
            "id": "speak-with-wh-digital",
            "label": "I’d like to speak with someone at WH Digital"
          },
          {
            "id": "send-information",
            "label": "Just send me some information for now"
          },
          {
            "id": "not-ready",
            "label": "I’m not ready to take the next step yet"
          }
        ],
        "maxLength": 2000,
        "multiline": false
      }
    ]
  }
};
