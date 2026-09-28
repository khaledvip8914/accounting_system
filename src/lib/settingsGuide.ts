export interface SettingExpertGuide {
  id: string;
  categoryBadge: {
    ar: string;
    en: string;
    color: string;
    bg: string;
    border: string;
  };
  functionality: {
    ar: string;
    en: string;
  };
  accountingImpact: {
    ar: string;
    en: string;
  };
  proTip: {
    ar: string;
    en: string;
  };
}

export const SETTINGS_EXPERT_GUIDES: Record<string, SettingExpertGuide> = {
  general: {
    id: 'general',
    categoryBadge: {
      ar: 'هوية قانونية وامتثال',
      en: 'Legal Identity & Compliance',
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
    },
    functionality: {
      ar: 'المرجع المركزي لبيانات المنشأة القانونية والتجارية؛ يشمل الاسم التجاري (عربي/إنجليزي)، الرقم الضريبي (VAT ID)، السجل التجاري (CR)، العنوان الوطني الدقيق، وشعار المنشأة.',
      en: 'Central repository for legal & commercial corporate data; includes dual-language trade names, VAT number, commercial registration, national address details, and corporate branding.',
    },
    accountingImpact: {
      ar: 'يُطبع كترويسة رسمية ملزمة نظاماً على كافة الفواتير والسندات والإشعارات الدائنة/المدينة. تطابق هذه البيانات يحمي المنشأة من بطلان الفواتير الضريبية وتعتبر شرطاً أساسياً لسلامة الفحص الميداني.',
      en: 'Printed as mandatory legal header on all tax invoices, vouchers, and credit notes. Essential for tax authority compliance and preventing invoice invalidation during audits.',
    },
    proTip: {
      ar: 'تأكد من مطابقة الرمز البريدي والرقم الإضافي للعنوان الوطني مع بيانات السجل التجاري لتفادي رفض الربط مع منصات الفوترة الإلكترونية.',
      en: 'Ensure postal code and national address match your official commercial registration exactly to avoid validation errors in e-invoicing platforms.',
    },
  },

  financialYears: {
    id: 'financialYears',
    categoryBadge: {
      ar: 'دورات محاسبية وإقفال',
      en: 'Accounting Cycles & Closing',
      color: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
    },
    functionality: {
      ar: 'إدارة الفترات والدورات المحاسبية السنوية، تحديد تواريخ الفتح والإقفال، وتفعيل قفل الفترات المحاسبية (Period Locking) لمنع التلاعب في العمليات المالية المؤرخة بأثر رجعي.',
      en: 'Manages annual fiscal periods, opening/closing dates, and period locking to prevent backdated manipulations in historical transactions.',
    },
    accountingImpact: {
      ar: 'إقفال السنة يرحل تلقائياً صافي الأرباح أو الخسائر من قائمة الدخل إلى حساب "الأرباح المبقاة" في حقوق الملكية، ويولد الأرصدة الافتتاحية للميزانية العمومية للعام الجديد بدقة بالغة.',
      en: 'Year-end closing automatically posts net profit/loss to Retained Earnings under Equity, generating opening balances for the balance sheet in the new fiscal year.',
    },
    proTip: {
      ar: 'لا تغلق السنة المالية رسمياً إلا بعد استلام تقرير المحاسب القانوني النهائي والمصادقة على التسويات الجردية والضرائب المستحقة.',
      en: 'Only close the financial year after receiving the external audit report and reconciling all year-end adjustments and provisions.',
    },
  },

  branches: {
    id: 'branches',
    categoryBadge: {
      ar: 'هيكلة تشغيلية ومراكز فروع',
      en: 'Multi-Branch Architecture',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
    },
    functionality: {
      ar: 'تنظيم الفروع الجغرافية ومنافذ البيع، وربط كل فرع بمستودعاته المعتمدة، صناديق الكاشير، موظفي المبيعات، وموقعه الجغرافي الدقيق بنطاق دائري (GPS Geofencing).',
      en: 'Configures geographic branches and sales outlets, linking each branch to dedicated warehouses, POS cashiers, staff, and GPS work radiuses.',
    },
    accountingImpact: {
      ar: 'يتيح استخراج موازين مراجعة وقوائم أرباح وخسائر مستقلة لكل فرع (Branch Profitability)، مما يكشف الفرع الأعلى أداءً والفرع المتعثر، مع خيار إصدار قوائم مالية موحدة للشركة.',
      en: 'Enables departmental trial balances and standalone income statements per branch to analyze unit-level profitability, along with consolidated financial statements.',
    },
    proTip: {
      ar: 'خصص حساب صندوق كاشير مستقل لكل فرع، وقم بالتحويل اليومي أو الأسبوعي إلى الحساب البنكي الرئيسي عبر سندات التحويل الداخلي لضبط السيولة.',
      en: 'Assign a dedicated cash drawer account for each branch, transferring funds daily/weekly to the main bank account via internal transfer vouchers.',
    },
  },

  analysisDimensions: {
    id: 'analysisDimensions',
    categoryBadge: {
      ar: 'محاسبة تكاليف وأبعاد تحليلية',
      en: 'Cost Accounting & Dimensions',
      color: '#c084fc',
      bg: 'rgba(192, 132, 252, 0.12)',
      border: 'rgba(192, 132, 252, 0.25)',
    },
    functionality: {
      ar: 'نظام محاسبي متعدد الأبعاد لتصنيف القيود والمصروفات والإيرادات حسب: مراكز التكلفة، المشاريع، خطوط الإنتاج، أو الأقسام الإدارية دون الحاجة لتفريغ وتضخيم شجرة الحسابات.',
      en: 'Multi-dimensional accounting tag system classifying ledger entries by cost centers, projects, product lines, or departments without cluttering the Chart of Accounts.',
    },
    accountingImpact: {
      ar: 'يمكنك من معرفة التكلفة الحقيقية لكل مشروع أو عقد ومقارنتها بالإيراد المحقق، وإجراء تحليل الانحرافات بين الميزانية التقديرية والتكاليف الفعلية بدقة بالغة.',
      en: 'Enables granular cost-versus-revenue analysis per contract/project, delivering precise variance analysis against operational budgets.',
    },
    proTip: {
      ar: 'اجعل بُعد "المشروع" أو "مركز التكلفة" إجبارياً على حسابات المصروفات التشغيلية والعمومية لضمان عدم وجود تكلفة ضائعة غير محملة على مصدرها.',
      en: 'Make dimension tagging mandatory on operational expense accounts to ensure zero unallocated corporate overhead.',
    },
  },

  theme: {
    id: 'theme',
    categoryBadge: {
      ar: 'تجربة مستخدم وبيئة عمل',
      en: 'UI/UX & Visual Ergonomics',
      color: '#818cf8',
      bg: 'rgba(129, 140, 248, 0.12)',
      border: 'rgba(129, 140, 248, 0.25)',
    },
    functionality: {
      ar: 'التحكم في الهوية البصرية للواجهة عبر 6 أنماط فائقة الفخامة تشمل: الزمرد الإمبراطوري، الياقوت المحيطي، الملكي الذهبي، الليلي العميق، والضوئي النقي، مع حفظ التفضيل سحابياً.',
      en: 'Controls UI appearance with 6 luxury themes (Emerald Prestige, Ocean Sapphire, Royal Gold, Deep Night, Pure Light), saved locally and persistently across sessions.',
    },
    accountingImpact: {
      ar: 'تقليل إجهاد العين لفرق المحاسبة والمراجعين خلال ساعات الإدخال والمراجعة الطويلة، مما يرفع دقة رصد الأرقام الحسابية ويقلل الأخطاء البشرية بنسبة ملحوظة.',
      en: 'Minimizes ocular fatigue during extensive data entry and audit cycles, enhancing numerical verification accuracy and reducing manual posting errors.',
    },
    proTip: {
      ar: 'استخدم نمط "الزمرد الإمبراطوري" أو "الياقوت المحيطي" لبيئة العمل اليومية، والنمط "الفاتح النقي" عند مقارنة الأرقام تحت إضاءة المكاتب النهارية القوية.',
      en: 'Select Emerald Luxury or Ocean Sapphire for modern dark workflows, and Pure Light when working in brightly lit office audit rooms.',
    },
  },

  subscription: {
    id: 'subscription',
    categoryBadge: {
      ar: 'إدارة الباقات والتراخيص',
      en: 'Subscription & Licensing',
      color: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.12)',
      border: 'rgba(96, 165, 250, 0.25)',
    },
    functionality: {
      ar: 'مراقبة خطة الاشتراك السحابية، تاريخ التجديد، سقف عدد الفروع، حد المستخدمين المتزامنين، والموديولات الإضافية المتاحة كإدارة الموارد البشرية والربط عبر API.',
      en: 'Monitors cloud subscription tier, renewal date, branch quotas, user seat limits, and add-on modules like HR and API access.',
    },
    accountingImpact: {
      ar: 'يضمن استدامة السجلات المحاسبية والوصول اللحظي لقواعد البيانات، وتفادي توقف إصدار الفواتير أو تقارير نهاية الشهر بسبب انتهاء الترخيص.',
      en: 'Ensures business continuity, real-time database availability, and prevents disruption of daily billing cycles due to license lapse.',
    },
    proTip: {
      ar: 'قم بجدولة مراجعة الباقة قبل موعد التجديد بـ 15 يوماً للتأكد من ملاءمة سعة التخزين وحدود العمليات لنمو أعمالك.',
      en: 'Schedule package reviews 15 days prior to expiration to adjust storage quotas and operational capacities for business expansion.',
    },
  },

  zatca: {
    id: 'zatca',
    categoryBadge: {
      ar: 'امتثال الفوترة الإلكترونية زكاة',
      en: 'ZATCA Phase 2 Clearance',
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    functionality: {
      ar: 'محرك الربط المباشر مع منصة "فاتورة" لهيئة الزكاة والضريبة والجمارك (المرحلة الثانية - الربط والتكامل)؛ يشمل توليد أزواج المفاتيح الرقمية (ECDSA) وشهادات الامتثال (CSID) والأختام المشفرة.',
      en: 'Direct clearance/reporting engine connected to ZATCA Fatoora platform (Phase 2); generates cryptographic ECDSA key pairs, CSID compliance certificates, and digital stamps.',
    },
    accountingImpact: {
      ar: 'اعتماد الفواتير الضريبية (B2B) لحظياً قبل إرسالها للعميل، وإبلاغ الفواتير المبسطة (B2C) خلال 24 ساعة، وحماية الشركة التامة من الغرامات الزكوية المغلظة.',
      en: 'Instant clearance of standard B2B invoices and 24h reporting of simplified B2C invoices, ensuring 100% statutory compliance and zero regulatory penalties.',
    },
    proTip: {
      ar: 'أتمم اختبارات بيئة المحاكاة (Simulation Mode) بنجاح أولاً، وتأكد من أن جميع الحقول الضريبية للأصناف مطابقة للكود الجمركي قبل النقل لبيئة الإنتاج الحية.',
      en: 'Complete simulation tests first and ensure all item tax categories match official customs classifications prior to going live.',
    },
  },

  currencies: {
    id: 'currencies',
    categoryBadge: {
      ar: 'عملات أجنبية وفروق صرف',
      en: 'Foreign Currencies & FX',
      color: '#4ade80',
      bg: 'rgba(74, 222, 128, 0.12)',
      border: 'rgba(74, 222, 128, 0.25)',
    },
    functionality: {
      ar: 'تعريف وتحديث العملات الأجنبية وأسعار تحويلها اليومية والتاريخية مقابل العملة الأساسية للنظام (SAR أو العملة المحلية المعتمدة).',
      en: 'Defines foreign currencies, updating daily and historical exchange conversion rates against the default operating currency.',
    },
    accountingImpact: {
      ar: 'معالجة فوارق العملة المحققة (Realized FX Gain/Loss) عند التحصيل والسداد، وإعادة تقييم أرصدة الذمم المدينة والدائنة الأجنبية بنهاية الفترة المالية (Unrealized FX).',
      en: 'Handles realized currency gain/loss on settlements, and automatically calculates unrealized FX revaluations on foreign AP/AR at period end.',
    },
    proTip: {
      ar: 'حدث أسعار الصرف فور ورود بوالص الاستيراد الأجنبية لضمان تقييم تكلفة المخزون الوارد وفق السعر الفعلي لتاريخ الشحن.',
      en: 'Update exchange rates on the exact shipment date of import purchase orders to capitalize true landed inventory costs.',
    },
  },

  taxes: {
    id: 'taxes',
    categoryBadge: {
      ar: 'ضرائب وإقرار القيمة المضافة',
      en: 'VAT Engine & Tax Rules',
      color: '#f87171',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
    },
    functionality: {
      ar: 'ضبط نسب ضريبة القيمة المضافة (النسبة الأساسية 15%، النسبة الصفرية للتصدير، المعفاة، وغير الخاضعة)، وتحديد شروط استحقاق الضريبة وتاريخ التوريد.',
      en: 'Configures Value Added Tax rates (standard 15%, zero-rated export, exempt, out-of-scope), defining tax supply date rules.',
    },
    accountingImpact: {
      ar: 'يقوم تلقائياً بتوجيه ضريبة المبيعات إلى حساب (أمانات ضريبة المخرجات) وضريبة المشتريات إلى (ضريبة المدخلات المستردة)، مما يجعل إعداد الإقرار الضريبي عملية فورية وخالية من الأخطاء.',
      en: 'Directs sales tax to Output VAT liability and purchase tax to Recoverable Input VAT asset, turning periodic VAT return filing into an automated 1-click process.',
    },
    proTip: {
      ar: 'لا تخلط بين "النسبة الصفرية" و"الإعفاء الضريبي"؛ فالأولى تمنحك حق استرداد ضريبة المدخلات للمشتريات ذات الصلة بينما المعفاة تحرمك من الاسترداد.',
      en: 'Never confuse Zero-Rated with Exempt; zero-rated sales retain input VAT deduction eligibility whereas exempt supplies require input tax apportionment.',
    },
  },

  payroll: {
    id: 'payroll',
    categoryBadge: {
      ar: 'أجور وتأمينات اجتماعية',
      en: 'Payroll & Social Insurance',
      color: '#2dd4bf',
      bg: 'rgba(45, 212, 191, 0.12)',
      border: 'rgba(45, 212, 191, 0.25)',
    },
    functionality: {
      ar: 'إدارة مكونات الراتب الشهري: الأجر الأساسي، بدل السكن، بدل النقل، البدلات الإضافية، الاستقطاعات، وأقساط السلف وقواعد خصم التأمينات الاجتماعية (GOSI).',
      en: 'Governs monthly payroll elements: base wage, housing, transport, variable allowances, deductions, staff loans, and social insurance calculations.',
    },
    accountingImpact: {
      ar: 'توليد قيد استحقاق الرواتب التلقائي: مدين (مصروفات الرواتب والبدلات موزعة على مراكز التكلفة) ودائن (حساب أمانات التأمينات، مستحقات الموظفين، وحسابات سلف العاملين).',
      en: 'Generates automated payroll accrual entries: debiting expense accounts by cost center, crediting net salaries payable, GOSI liability, and employee loan receivables.',
    },
    proTip: {
      ar: 'اربط بدلات الموظفين بمراكز التكلفة الخاصة بأقسامهم (مبيعات، تشغيل، إدارة) لتحقيق توزيع عادل ودقيق لتكلفة العمالة على المنتجات.',
      en: 'Map employee allowances to departmental cost centers (Sales, Operations, Admin) to calculate true operational unit economics.',
    },
  },

  users: {
    id: 'users',
    categoryBadge: {
      ar: 'أمن النظام وسجل التدقيق',
      en: 'Access Control & Audit Trail',
      color: '#94a3b8',
      bg: 'rgba(148, 163, 184, 0.12)',
      border: 'rgba(148, 163, 184, 0.25)',
    },
    functionality: {
      ar: 'إنشاء وإدارة حسابات المستخدمين والمحاسبين والمدققين، تعيين الفروع المسموح بكل مستخدم بالاطلاع عليها، ومراقبة الجلسات وتتبع آخر تسجيل دخول.',
      en: 'Creates and administers staff user accounts, allocating permitted branches, managing session tokens, and monitoring user activities.',
    },
    accountingImpact: {
      ar: 'تحقيق متطلبات الرقابة الداخلية وإلزامية توثيق هوية المستخدم الذي أنشأ أو عدل أو رحل أي قيد محاسبي أو فاتورة، مما يسهل التدقيق الجنائي المالي (Audit Trail).',
      en: 'Enforces internal accounting control; logs the exact identity of who drafted, posted, or altered any financial voucher for forensic auditability.',
    },
    proTip: {
      ar: 'امنح كل محاسب حساباً منفرداً ولا تعتمد على حسابات مجمعة أو مشاركة كلمات المرور مطلقاً لضمان عدم ضياع المسؤولية القانونية عند التدقيق.',
      en: 'Enforce individual unique logins; never share admin accounts to ensure undeniable individual accountability during internal audits.',
    },
  },

  roles: {
    id: 'roles',
    categoryBadge: {
      ar: 'فصل المهام والصلاحيات',
      en: 'Segregation of Duties',
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.12)',
      border: 'rgba(167, 139, 250, 0.25)',
    },
    functionality: {
      ar: 'مصفوفة صلاحيات تفصيلية ودقيقة: تحدد لكل دور وظيفي حق (العرض، الإضافة، التعديل، الحذف، الترحيل المالي، والطباعة) لكل صفحة وزر وقائمة داخل النظام.',
      en: 'Granular permissions matrix configuring view, create, edit, delete, post, and export rights across every screen and operational button in the ERP.',
    },
    accountingImpact: {
      ar: 'تطبيق المعيار المحاسبي العالمي "فصل المهام" (Segregation of Duties): كأن يقوم كاشير المبيعات بتسجيل الفاتورة بينما يعتمد المحاسب القيد المالي، ويقوم المدير المالي فقط بفك الترحيل.',
      en: 'Applies mandatory Segregation of Duties (SoD): separates transaction creation from payment authorization and financial posting.',
    },
    proTip: {
      ar: 'احجب صلاحية "حذف القيود" و"فك الترحيل" عن المحاسبين المبتدئين واقصرها حصراً على مدير الحسابات والمدير المالي بموافقة كتابية.',
      en: 'Restrict unposting and entry deletion privileges exclusively to the Financial Controller to maintain financial integrity.',
    },
  },

  paymentTerms: {
    id: 'paymentTerms',
    categoryBadge: {
      ar: 'إدارة الائتمان ومواعيد السداد',
      en: 'Credit Terms & Aging',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
    },
    functionality: {
      ar: 'هيكلة شروط وآجال السداد للفواتير (دفع فوري نقدي، 15 يوماً، 30 يوماً، 60 يوماً، أو دفعات مجدولة بنسب مئوية وتواريخ محددة).',
      en: 'Structures invoice payment credit terms (Net Cash, Net 15, Net 30, Net 60, or customized milestone installments with specific due dates).',
    },
    accountingImpact: {
      ar: 'يتحكم في تحديد تاريخ الاستحقاق الفعلي للفاتورة، وتوليد تقرير "أعمار الديون" (Accounts Receivable Aging)، مما يوضح مؤشرات السيولة ومخصص الديون المشكوك في تحصيلها.',
      en: 'Computes accurate maturity dates, feeding directly into Accounts Receivable Aging reports and Allowance for Doubtful Accounts provisioning.',
    },
    proTip: {
      ar: 'اربط العملاء ذوي التصنيف الائتماني الضعيف بشروط سداد فورية (Cash on Delivery) لتجنب تجمد السيولة النقدية للشركة.',
      en: 'Enforce Cash on Delivery terms for clients with low credit ratings to preserve working capital and eliminate bad debt risk.',
    },
  },

  paymentMethods: {
    id: 'paymentMethods',
    categoryBadge: {
      ar: 'توجيه القيود والتسوية البنكية',
      en: 'Payment Linking & Treasury',
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
    },
    functionality: {
      ar: 'تعريف قنوات الدفع (شبكة مدى، فيزا، ماستركارد، تحويل بنكي، نقد، شيكات)، وربط كل وسيلة بحساب مالي وسيط أو حساب البنك المحدد في شجرة الحسابات.',
      en: 'Defines transaction payment channels (Mada, Visa, Wire Transfer, Cash, Cheques), mapping each channel to dedicated ledger accounts.',
    },
    accountingImpact: {
      ar: 'أتمتة قيود اليومية المقابلة لعمليات البيع والشراء؛ مما يلغي التوجيه المحاسبي الخاطئ ويسهل عملية "التسوية البنكية والمطابقة" بين كشوف الحساب وكشوف نقاط البيع.',
      en: 'Automates corresponding journal entries for cash/card settlements, preventing misallocation and streamlining monthly bank reconciliations.',
    },
    proTip: {
      ar: 'أنشئ حساباً وسيطاً تحت مسمى "معلق نقاط البيع" لمدفوعات البطاقات لعزل عمولة البنك (0.8% مثلاً) قبل ترحيل الصافي إلى الحساب الجاري.',
      en: 'Route card settlements through a "POS Clearing Account" to easily deduct and reconcile merchant fees before crediting operating bank accounts.',
    },
  },

  additionalFields: {
    id: 'additionalFields',
    categoryBadge: {
      ar: 'تخصيص البيانات وتكامل السجلات',
      en: 'Custom Fields & Metadata',
      color: '#e879f9',
      bg: 'rgba(232, 121, 249, 0.12)',
      border: 'rgba(232, 121, 249, 0.25)',
    },
    functionality: {
      ar: 'إضافة حقول بيانات مخصصة ديناميكية (نصوص، تواريخ، أرقام، قوائم منسدلة) لشاشات الفواتير والعملاء والأصناف والسندات بما يلائم الأنشطة التجارية الفريدة.',
      en: 'Injects dynamic custom fields (text, date, numeric, dropdowns) into invoices, customer cards, products, and journal vouchers.',
    },
    accountingImpact: {
      ar: 'توثيق البيانات الإضافية المؤيدة محاسبياً كأرقام بوالص الشحن، أرقام أوامر الشراء (PO)، أسماء السائقين أو المهندسين، واستخراج تقارير مالية مخصصة بناءً عليها.',
      en: 'Stores supportive audit metadata such as Customer PO numbers, vessel names, or engineering project IDs, enabling filtered accounting reports.',
    },
    proTip: {
      ar: 'أضف حقل "رقم أمر الشراء للعميل (Customer PO)" واجعله إجبارياً على الفواتير الآجلة لتسريع دورة اعتماد وصرف الدفعات من الشركات الكبرى.',
      en: 'Create a mandatory "Customer PO Number" custom field on credit invoices to accelerate billing approval and payment release from corporate clients.',
    },
  },

  editProfile: {
    id: 'editProfile',
    categoryBadge: {
      ar: 'الملف التعريفي والتواصل',
      en: 'Corporate Communications',
      color: '#fb923c',
      bg: 'rgba(251, 146, 60, 0.12)',
      border: 'rgba(251, 146, 60, 0.25)',
    },
    functionality: {
      ar: 'إدارة وتحديث بيانات الاتصال الرسمية للمنشأة، البريد الإلكتروني المالي المعتمد، أرقام هواتف خدمة العملاء، والموقع الإلكتروني.',
      en: 'Maintains corporate contact credentials, official financial inquiry emails, corporate customer care phone lines, and web domains.',
    },
    accountingImpact: {
      ar: 'توجيه إشعارات النظام المالية وتقارير التحصيل التلقائية وعروض الأسعار من البريد المعتمد للشركة مما يعزز الموثوقية التجارية ويمنع تصنيف الرسائل كبريد عشوائي.',
      en: 'Ensures system notifications, customer statements, and automated receipts originate from verified corporate channels, ensuring delivery reliability.',
    },
    proTip: {
      ar: 'استخدم بريداً مؤسسياً موحداً (مثل accounts@yourcompany.com) بدلاً من البريد الشخصي لضمان استمرارية الاطلاع على المراسلات المالية عند تبدل الموظفين.',
      en: 'Use an organizational role mailbox (e.g. accounts@yourcompany.com) to safeguard continuity of billing archives across staff turnover.',
    },
  },

  attachments: {
    id: 'attachments',
    categoryBadge: {
      ar: 'أرشفة إلكترونية ومستندات مؤيدة',
      en: 'Document Archiving & Audit',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
    },
    functionality: {
      ar: 'إدارة مساحات وسياسات حفظ وتصنيف المستندات الإلكترونية المرفقة (عقود، إيصالات، مستخلصات، صور شيكات، إشعارات بنكية) وربطها المباشر بالقيود والعمليات.',
      en: 'Administers policies and cloud storage for supportive documents (contracts, bank slips, vendor invoices, delivery orders), linked directly to vouchers.',
    },
    accountingImpact: {
      ar: 'العمود الفقري للإثبات المحاسبي؛ وجود المرفق المؤيد للقيد يحمي القيود من الرفض في الفحص المالي، ويوفر ساعات طويلة على المراجعين الخارجيين أثناء جولات التدقيق.',
      en: 'The backbone of evidentiary bookkeeping; substantiates financial ledger entries during external statutory audits and tax investigations.',
    },
    proTip: {
      ar: 'اشترط إرفاق صورة إيصال التحويل أو الفاتورة الضريبية الأصلية للمورد في أي سند صرف يتجاوز 1000 ريال لضمان سلامة الدورة المستندية.',
      en: 'Require mandatory digital attachments for all vendor expenses above $500 to uphold bulletproof document trail standards.',
    },
  },

  productProps: {
    id: 'productProps',
    categoryBadge: {
      ar: 'خصائص الأصناف وتكلفة المخزون',
      en: 'Product Variants & Inventory Cost',
      color: '#818cf8',
      bg: 'rgba(129, 140, 248, 0.12)',
      border: 'rgba(129, 140, 248, 0.25)',
    },
    functionality: {
      ar: 'تعريف مصفوفات الخصائص المتغيرة للمنتجات (مثل الألوان، المقاسات، الأوزان، أرقام التشغيلات Batch Numbers، وتواريخ انتهاء الصلاحية) وتوليد باركودات مشتقة.',
      en: 'Defines dynamic product attribute matrices (sizes, colors, batch/lot numbers, expiration dates), auto-generating derived variant barcodes.',
    },
    accountingImpact: {
      ar: 'ضبط تقييم المخزون السلعي بدقة؛ مما يمنع احتساب تكلفة صنف عالي الجودة على صنف اقتصادي، ويسمح باحتساب مخصص المخزون الراكد أو منتهي الصلاحية بشكل دقيق.',
      en: 'Refines inventory valuation per variant, preventing miscalculated COGS and enabling accurate allowances for damaged or expired inventory.',
    },
    proTip: {
      ar: 'فعل ميزة رقم التشغيلة وتاريخ الانتهاء للمنتجات الغذائية والطبية لتطبيق معيار (الوارد أولاً ينتهي أولاً FEFO) في إخراج البضاعة من المستودع.',
      en: 'Enable batch & expiry tracking for perishable goods to enforce First-Expired, First-Out (FEFO) warehouse inventory dispatching.',
    },
  },

  api: {
    id: 'api',
    categoryBadge: {
      ar: 'ربط برمجي وتكامل سحابي',
      en: 'API & External Integration',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
    },
    functionality: {
      ar: 'إدارة مفاتيح الربط البرمجي الموثقة (API Keys & Webhooks) لربط النظام محاسبياً ومخزنياً مع منصات التجارة الإلكترونية (سلة، زد، شوبيفاي) أو تطبيقات نقاط البيع الخارجية.',
      en: 'Generates secure API keys and Webhook endpoints connecting QaydX with e-commerce platforms (Salla, Zid, Shopify) and external ERP microservices.',
    },
    accountingImpact: {
      ar: 'مزامنة فواتير المبيعات، حركات المخزون، وسندات القبض لحظياً فور تنفيذ الطلب في المتجر؛ مما يقضي تماماً على أخطاء الإدخال المكرر ويوحد الأرصدة المالية فورياً.',
      en: 'Real-time synchronization of sales invoices and stock deductions directly upon order placement, eradicating manual dual-entry accounting discrepancies.',
    },
    proTip: {
      ar: 'احرص على تقييد صلاحيات كل مفتاح API بنطاق IP محدد إن أمكن، ولا تشارك المفتاح السري (API Secret) في أي كود مرئي للمستخدمين في واجهة المتجر.',
      en: 'Whitelist server IP addresses for your API keys and store client secrets in secure server-side environment variables.',
    },
  },

  whatsapp: {
    id: 'whatsapp',
    categoryBadge: {
      ar: 'أتمتة الإشعارات وتسريع التحصيل',
      en: 'WhatsApp Billing Automation',
      color: '#4ade80',
      bg: 'rgba(74, 222, 128, 0.12)',
      border: 'rgba(74, 222, 128, 0.25)',
    },
    functionality: {
      ar: 'ربط النظام برقم واتساب الأعمال المعتمد لإرسال روابط الفواتير الإلكترونية المعتمدة، وسندات القبض، ومذكرات التنبيه اللحظية بقرب موعد استحقاق الدفعات.',
      en: 'Connects WhatsApp Business API to dispatch instant links for certified e-invoices, payment receipts, and automated payment due reminders.',
    },
    accountingImpact: {
      ar: 'يخفض فترة دوران الذمم المدينة (Days Sales Outstanding - DSO) بنسبة تتجاوز 40% عبر إشعار العميل الفوري وتسهيل الدفع الإلكتروني المباشر دون الحاجة لمطالبات ورقية.',
      en: 'Reduces Days Sales Outstanding (DSO) by over 40% through instant customer mobile notifications with embedded 1-click digital payment gateways.',
    },
    proTip: {
      ar: 'قم بجدولة رسائل تذكير لطيفة قبل تاريخ استحقاق الفاتورة بـ 3 أيام، متبوعة برسالة شكر تلقائية عند إتمام السداد لتعزيز العلاقة التجارية مع العملاء.',
      en: 'Automate a polite reminder 3 days prior to invoice due date, followed by an immediate automated thank-you receipt upon payment posting.',
    },
  },
};
