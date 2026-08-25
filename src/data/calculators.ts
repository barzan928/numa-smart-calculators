import { CalculatorItem, CategoryInfo } from '../types';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'finance',
    titleAr: 'المال والأعمال',
    titleEn: 'Finance & Business',
    description: 'أدوات لحساب الأرباح والأسعار والخصومات والأقساط',
    iconName: 'Briefcase',
  },
  {
    id: 'math',
    titleAr: 'الرياضيات',
    titleEn: 'Mathematics',
    description: 'حساب النسب المئوية والمتوسطات والكسور والمعادلات',
    iconName: 'Calculator',
  },
  {
    id: 'conversions',
    titleAr: 'التحويلات',
    titleEn: 'Unit Conversions',
    description: 'تحويل وحدات الطول، الوزن، المساحة، الحجم والحرارة',
    iconName: 'ArrowLeftRight',
  },
  {
    id: 'time_date',
    titleAr: 'الوقت والتاريخ',
    titleEn: 'Time & Date',
    description: 'حساب العمر الدقيق، فرق التواريخ وإضافة الأيام',
    iconName: 'CalendarClock',
  },
  {
    id: 'health',
    titleAr: 'الصحة',
    titleEn: 'Health & Fitness',
    description: 'مؤشر كتلة الجسم BMI، السعرات اليومية والوزن المثالي',
    iconName: 'Activity',
  },
  {
    id: 'daily_life',
    titleAr: 'الحياة اليومية',
    titleEn: 'Daily Life',
    description: 'المصروف والميزانية، استهلاك الكهرباء والمساحات',
    iconName: 'Sparkles',
  },
];

export const CALCULATORS_DATA: CalculatorItem[] = [
  // ================= 1. المال والأعمال (Finance) =================
  {
    id: 'profit-loss',
    name: 'Profit and Loss',
    nameAr: 'حاسبة الربح والخسارة',
    description: 'احسب صافي الربح أو الخسارة ونسبة العائد',
    category: 'finance',
    categoryAr: 'المال والأعمال',
    iconName: 'TrendingUp',
    isQuick: true,
    defaultPopularity: 45,
    keywords: [
      'profit', 'loss', 'ربح', 'الربح', 'خسارة', 'الخسارة', 'مكسب', 'ارباح', 'صافي', 'عائد',
      'مبيعات', 'تجارة', 'business', 'revenue', 'gain', 'تداول'
    ],
    fields: [
      { id: 'cost', label: 'سعر التكلفة', placeholder: 'أدخل تكلفة الشراء أو الإنتاج', unit: 'د.ع' },
      { id: 'revenue', label: 'سعر البيع الإجمالي', placeholder: 'أدخل إجمالي سعر البيع', unit: 'د.ع' },
    ],
    resultPlaceholder: 'صافي الربح / الخسارة ونسبة العائد ستظهر هنا',
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin',
    nameAr: 'حاسبة هامش الربح',
    description: 'حساب النسبة المئوية لهامش الربح من المبيعات',
    category: 'finance',
    categoryAr: 'المال والأعمال',
    iconName: 'Percent',
    defaultPopularity: 35,
    keywords: [
      'profit', 'margin', 'هامش', 'هامش الربح', 'ربح', 'الربح', 'نسبة الربح', 'markup',
      'percentage', 'مارجن', 'ارباح'
    ],
    fields: [
      { id: 'cost', label: 'التكلفة', placeholder: 'أدخل قيمة التكلفة', unit: 'د.ع' },
      { id: 'revenue', label: 'الإيراد الإجمالي', placeholder: 'أدخل إجمالي الإيرادات', unit: 'د.ع' },
    ],
    resultPlaceholder: 'هامش الربح الإجمالي والصافي سيظهر هنا',
  },
  {
    id: 'selling-price',
    name: 'Selling Price',
    nameAr: 'حاسبة سعر البيع',
    description: 'تحديد سعر البيع المثالي بناءً على هامش الربح المستهدف',
    category: 'finance',
    categoryAr: 'المال والأعمال',
    iconName: 'Tag',
    defaultPopularity: 30,
    keywords: [
      'price', 'selling', 'سعر', 'سعر البيع', 'السعر', 'تسعير', 'بيع', 'تكلفة', 'مارجن',
      'pricing', 'cost', 'تحديد السعر'
    ],
    fields: [
      { id: 'cost', label: 'تكلفة المنتج', placeholder: 'أدخل تكلفة الوحدة', unit: 'د.ع' },
      { id: 'target_margin', label: 'هامش الربح المستهدف', placeholder: 'مثال: 25', unit: '%' },
    ],
    resultPlaceholder: 'سعر البيع الموصى به ومقدار الربح سيظهر هنا',
  },
  {
    id: 'discount',
    name: 'Discount Calculator',
    nameAr: 'حاسبة الخصم',
    description: 'احسب السعر النهائي بعد تطبيق نسبة أو قيمة الخصم بسهولة',
    category: 'finance',
    categoryAr: 'المال والأعمال',
    iconName: 'BadgePercent',
    isQuick: true,
    defaultPopularity: 50,
    keywords: [
      'discount', 'sale', 'off', 'خصم', 'الخصم', 'تخفيض', 'تخفيضات', 'تنزيل', 'تنزيلات',
      'عرض', 'عروض', 'اوفر', 'وفر', 'توفير', 'كوبون', 'coupon', 'سعر بعد الخصم'
    ],
    fields: [
      { id: 'original_price', label: 'السعر الأصلي', placeholder: 'أدخل السعر قبل الخصم', unit: 'د.ع' },
      { id: 'discount_rate', label: 'نسبة الخصم', placeholder: 'أدخل نسبة الخصم', unit: '%' },
    ],
    resultPlaceholder: 'السعر النهائي ومقدار التوفير سيظهر هنا',
  },
  {
    id: 'finance-percentage',
    name: 'Financial Percentage',
    nameAr: 'حاسبة النسبة المئوية للمال',
    description: 'حساب الضريبة، الزيادة السنوية والتغير في رأس المال',
    category: 'finance',
    categoryAr: 'المال والأعمال',
    iconName: 'Percent',
    isQuick: true,
    defaultPopularity: 25,
    keywords: [
      'tax', 'finance', 'ضريبة', 'الضريبة', 'قيمة مضافة', 'نسبة المال', 'زيادة', 'استثمار',
      'vat', 'ارباح المال', 'فائدة'
    ],
    fields: [
      { id: 'amount', label: 'المبلغ الأساسي', placeholder: 'أدخل المبلغ', unit: 'د.ع' },
      { id: 'percentage', label: 'النسبة المئوية', placeholder: 'أدخل النسبة المطلوبة', unit: '%' },
    ],
    resultPlaceholder: 'قيمة النسبة والمجموع الكلي سيظهر هنا',
  },
  {
    id: 'installments',
    name: 'Installments Calculator',
    nameAr: 'حاسبة الأقساط',
    description: 'جدولة الدفعات الشهرية وإجمالي الفوائد وفترة السداد',
    category: 'finance',
    categoryAr: 'المال والأعمال',
    iconName: 'CreditCard',
    isQuick: true,
    defaultPopularity: 48,
    keywords: [
      'loan', 'installment', 'installments', 'قسط', 'اقساط', 'الاقساط', 'تمويل', 'قرض',
      'قروض', 'سداد', 'مرابحة', 'فائدة', 'credit', 'bank', 'بنك', 'دفعات'
    ],
    fields: [
      { id: 'total_loan', label: 'مبلغ التمويل / القرض', placeholder: 'أدخل المبلغ الكلي', unit: 'د.ع' },
      { id: 'months', label: 'مدة السداد (بالأشهر)', placeholder: 'مثال: 24 شهر', unit: 'شهر' },
      { id: 'interest_rate', label: 'نسبة الفائدة السنوية (إن وجدت)', placeholder: '0 إن لم توجد فائدة', unit: '%' },
    ],
    resultPlaceholder: 'القسط الشهري وإجمالي المبلغ المستحق سيظهر هنا',
  },

  // ================= 2. الرياضيات (Math) =================
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    nameAr: 'حاسبة النسبة المئوية',
    description: 'حساب النسب الرياضية والكسور المئوية بدقة',
    category: 'math',
    categoryAr: 'الرياضيات',
    iconName: 'Percent',
    isQuick: true,
    defaultPopularity: 50,
    keywords: [
      'percentage', 'percent', 'نسبة', 'النسبة', 'نسبة مئوية', 'مئوية', 'مئوي', 'حساب النسبة',
      'ratio', '%', 'معدل', 'درجات', 'نسبتي'
    ],
    fields: [
      { id: 'part', label: 'القيمة الجزئية (العدد)', placeholder: 'أدخل العدد الأول' },
      { id: 'total', label: 'القيمة الكلية', placeholder: 'أدخل العدد الكلي' },
    ],
    resultPlaceholder: 'النسبة المئوية للعدد ستظهر هنا',
  },
  {
    id: 'average',
    name: 'Average Calculator',
    nameAr: 'حاسبة المتوسط',
    description: 'حساب المتوسط الحسابي والوسيط لمجموعة أرقام',
    category: 'math',
    categoryAr: 'الرياضيات',
    iconName: 'Divide',
    defaultPopularity: 28,
    keywords: [
      'average', 'mean', 'median', 'متوسط', 'المتوسط', 'معدل', 'المعدل', 'وسيط', 'مجموع',
      'احصاء', 'معدل درجات'
    ],
    fields: [
      { id: 'numbers', label: 'الأرقام (مفصولة بفواصل)', placeholder: 'مثال: 10, 20, 35, 50, 80' },
    ],
    resultPlaceholder: 'المتوسط الحسابي، المجموع، والوسيط ستظهر هنا',
  },
  {
    id: 'increase-decrease',
    name: 'Increase & Decrease',
    nameAr: 'حاسبة الزيادة والنقصان',
    description: 'حساب معدل التغير والفرق النسبي بين قيمتين',
    category: 'math',
    categoryAr: 'الرياضيات',
    iconName: 'ArrowUpDown',
    defaultPopularity: 22,
    keywords: [
      'change', 'growth', 'زيادة', 'نقصان', 'معدل التغير', 'فرق', 'تغير', 'تضخم', 'نمو',
      'انخفاض', 'الفرق النسبي'
    ],
    fields: [
      { id: 'initial_value', label: 'القيمة الابتدائية', placeholder: 'أدخل القيمة السابقة' },
      { id: 'final_value', label: 'القيمة النهائية', placeholder: 'أدخل القيمة الجديدة' },
    ],
    resultPlaceholder: 'نسبة التغير (زيادة أو نقصان) ستظهر هنا',
  },
  {
    id: 'fractions',
    name: 'Fractions Calculator',
    nameAr: 'حاسبة الكسور',
    description: 'جمع وطرح وضرب وتبسيط الكسور الاعتيادية',
    category: 'math',
    categoryAr: 'الرياضيات',
    iconName: 'Layers',
    defaultPopularity: 20,
    keywords: [
      'fraction', 'fractions', 'كسر', 'كسور', 'الكسور', 'بسط', 'مقام', 'تبسيط', 'رياضيات',
      'جمع كسور', 'طرح كسور'
    ],
    fields: [
      { id: 'fraction1', label: 'الكسر الأول (بسط/مقام)', placeholder: 'مثال: 3/4' },
      { id: 'fraction2', label: 'الكسر الثاني (بسط/مقام)', placeholder: 'مثال: 1/2' },
    ],
    resultPlaceholder: 'الناتج في أبسط صورة كسرية وعشرية سيظهر هنا',
  },
  {
    id: 'arithmetic',
    name: 'Arithmetic Operations',
    nameAr: 'حاسبة العمليات الحسابية',
    description: 'إجراء العمليات الحسابية والمعادلات الرياضية الأساسية',
    category: 'math',
    categoryAr: 'الرياضيات',
    iconName: 'Calculator',
    defaultPopularity: 32,
    keywords: [
      'math', 'calc', 'معادلة', 'عمليات', 'جمع', 'طرح', 'ضرب', 'قسمة', 'حساب', 'معادلات',
      'expression', 'الة حاسبة'
    ],
    fields: [
      { id: 'expression', label: 'المعادلة الحسابية', placeholder: 'مثال: (150 * 4) + 220' },
    ],
    resultPlaceholder: 'النتيجة الرياضية النهائية ستظهر هنا',
  },

  // ================= 3. التحويلات (Conversions) =================
  {
    id: 'length',
    name: 'Length Converter',
    nameAr: 'حاسبة تحويل الطول',
    description: 'تحويل الأمتار، السنتيمترات، البوصات، والأقدام والميل',
    category: 'conversions',
    categoryAr: 'التحويلات',
    iconName: 'Ruler',
    defaultPopularity: 30,
    keywords: [
      'length', 'distance', 'طول', 'الطول', 'مسافة', 'متر', 'سم', 'قدم', 'انش', 'بوصة',
      'كيلومتر', 'ميل', 'meter', 'inch', 'foot', 'feet', 'km', 'cm', 'تحويل الاطوال'
    ],
    fields: [
      { id: 'value', label: 'القيمة المراد تحويلها', placeholder: 'أدخل القيمة' },
      { id: 'from_unit', label: 'من وحدة', placeholder: 'متر / قدم / إنش / سم' },
      { id: 'to_unit', label: 'إلى وحدة', placeholder: 'متر / قدم / إنش / سم' },
    ],
    resultPlaceholder: 'القيمة المحولة بوحدات القياس المختلفة ستظهر هنا',
  },
  {
    id: 'weight',
    name: 'Weight Converter',
    nameAr: 'حاسبة تحويل الوزن',
    description: 'تحويل الكيلوجرامات، الباوند، الأونصة والغرامات',
    category: 'conversions',
    categoryAr: 'التحويلات',
    iconName: 'Scale',
    defaultPopularity: 34,
    keywords: [
      'weight', 'mass', 'وزن', 'الوزن', 'كتلة', 'كيلو', 'كيلوغرام', 'باوند', 'جرام', 'غرام',
      'اونصة', 'رطل', 'kg', 'lbs', 'gram', 'ounce', 'pound', 'تحويل الوزن'
    ],
    fields: [
      { id: 'weight_val', label: 'الوزن', placeholder: 'أدخل قيمة الوزن' },
      { id: 'from_unit', label: 'من وحدة', placeholder: 'كجم / باوند / غرام / أونصة' },
      { id: 'to_unit', label: 'إلى وحدة', placeholder: 'كجم / باوند / غرام / أونصة' },
    ],
    resultPlaceholder: 'الوزن المعادل بجميع الوحدات سيظهر هنا',
  },
  {
    id: 'area',
    name: 'Area Converter',
    nameAr: 'حاسبة تحويل المساحة',
    description: 'تحويل المتر المربع، الهكتار، الفدان والقدم المربع',
    category: 'conversions',
    categoryAr: 'التحويلات',
    iconName: 'Maximize2',
    defaultPopularity: 22,
    keywords: [
      'area', 'مساحة', 'المساحة', 'متر مربع', 'هكتار', 'فدان', 'دونم', 'قدم مربع',
      'sqm', 'sqft', 'acre', 'hectare', 'تحويل المساحات'
    ],
    fields: [
      { id: 'area_val', label: 'المساحة', placeholder: 'أدخل المساحة' },
      { id: 'from_unit', label: 'من وحدة', placeholder: 'متر مربع / هكتار / قدم مربع' },
      { id: 'to_unit', label: 'إلى وحدة', placeholder: 'متر مربع / هكتار / قدم مربع' },
    ],
    resultPlaceholder: 'المساحة المحولة ستظهر هنا',
  },
  {
    id: 'volume',
    name: 'Volume Converter',
    nameAr: 'حاسبة تحويل الحجم',
    description: 'تحويل اللتر، المتر المكعب، الجالون والمليلتر',
    category: 'conversions',
    categoryAr: 'التحويلات',
    iconName: 'Box',
    defaultPopularity: 20,
    keywords: [
      'volume', 'حجم', 'الحجم', 'سعة', 'لتر', 'متر مكعب', 'جالون', 'مل', 'liter',
      'gallon', 'm3', 'ml', 'تحويل السوائل'
    ],
    fields: [
      { id: 'vol_val', label: 'الحجم', placeholder: 'أدخل مقدار الحجم' },
      { id: 'from_unit', label: 'من وحدة', placeholder: 'لتر / جالون / متر مكعب' },
      { id: 'to_unit', label: 'إلى وحدة', placeholder: 'لتر / جالون / متر مكعب' },
    ],
    resultPlaceholder: 'الحجم المحول سيظهر هنا',
  },
  {
    id: 'temperature',
    name: 'Temperature Converter',
    nameAr: 'حاسبة درجة الحرارة',
    description: 'تحويل بين الدرجة المئوية (سيليزيوس) والفهرنهايت والكلفن',
    category: 'conversions',
    categoryAr: 'التحويلات',
    iconName: 'Thermometer',
    defaultPopularity: 26,
    keywords: [
      'temperature', 'temp', 'حرارة', 'الحرارة', 'درجة', 'سيليزيوس', 'فهرنهايت', 'كلفن',
      'celsius', 'fahrenheit', 'kelvin', 'طقس', 'تحويل الحرارة'
    ],
    fields: [
      { id: 'temp_val', label: 'درجة الحرارة', placeholder: 'أدخل الدرجة' },
      { id: 'from_unit', label: 'من مقياس', placeholder: 'سيليزيوس (°C) / فهرنهايت (°F)' },
      { id: 'to_unit', label: 'إلى مقياس', placeholder: 'سيليزيوس (°C) / فهرنهايت (°F)' },
    ],
    resultPlaceholder: 'درجة الحرارة المعادلة ستظهر هنا',
  },
  {
    id: 'speed',
    name: 'Speed Converter',
    nameAr: 'حاسبة تحويل السرعة',
    description: 'تحويل كم/ساعة، ميل/ساعة، ومتر/ثانية والعقدة البحرية',
    category: 'conversions',
    categoryAr: 'التحويلات',
    iconName: 'Gauge',
    defaultPopularity: 22,
    keywords: [
      'speed', 'velocity', 'سرعة', 'السرعة', 'كم/س', 'ميل/س', 'عقدة', 'متر/ث',
      'kmh', 'mph', 'knot', 'سرعه', 'تحويل السرعة'
    ],
    fields: [
      { id: 'speed_val', label: 'مقدار السرعة', placeholder: 'أدخل السرعة' },
      { id: 'from_unit', label: 'من وحدة', placeholder: 'كم/ساعة / ميل/ساعة' },
      { id: 'to_unit', label: 'إلى وحدة', placeholder: 'كم/ساعة / ميل/ساعة' },
    ],
    resultPlaceholder: 'السرعة المقابلة بوحدات القياس ستظهر هنا',
  },

  // ================= 4. الوقت والتاريخ (Time & Date) =================
  {
    id: 'age',
    name: 'Age Calculator',
    nameAr: 'حاسبة العمر',
    description: 'احسب عمرك الدقيق بالسنوات والأشهر والأيام والساعات',
    category: 'time_date',
    categoryAr: 'الوقت والتاريخ',
    iconName: 'Hourglass',
    isQuick: true,
    defaultPopularity: 49,
    keywords: [
      'age', 'birthday', 'birth', 'عمر', 'العمر', 'ميلاد', 'تاريخ الميلاد', 'كم عمري',
      'سنوات', 'سنة', 'تاريخ', 'ولادة', 'احسب عمري', 'مواليد'
    ],
    fields: [
      { id: 'birth_date', label: 'تاريخ الميلاد', placeholder: 'يوم / شهر / سنة', type: 'date' },
    ],
    resultPlaceholder: 'العمر بالتفصيل وموعد عيد الميلاد القادم سيظهر هنا',
  },
  {
    id: 'date-difference',
    name: 'Date Difference',
    nameAr: 'حاسبة الفرق بين تاريخين',
    description: 'حساب عدد الأيام والأسابيع والأشهر بين أي تاريخين محددين',
    category: 'time_date',
    categoryAr: 'الوقت والتاريخ',
    iconName: 'CalendarRange',
    defaultPopularity: 32,
    keywords: [
      'date', 'difference', 'فرق تاريخ', 'فارق', 'ايام', 'بين تاريخين', 'كم يوم',
      'حساب الايام', 'calendar', 'days', 'تاريخ', 'فارق الايام'
    ],
    fields: [
      { id: 'start_date', label: 'التاريخ الأول (البداية)', placeholder: 'اختر التاريخ', type: 'date' },
      { id: 'end_date', label: 'التاريخ الثاني (النهاية)', placeholder: 'اختر التاريخ', type: 'date' },
    ],
    resultPlaceholder: 'عدد الأيام وفارق الوقت سيظهر هنا',
  },
  {
    id: 'add-days',
    name: 'Add Days to Date',
    nameAr: 'حاسبة إضافة أيام إلى تاريخ',
    description: 'معرفة التاريخ المستقبلي بعد إضافة عدد معين من الأيام أو الأشهر',
    category: 'time_date',
    categoryAr: 'الوقت والتاريخ',
    iconName: 'CalendarPlus',
    defaultPopularity: 20,
    keywords: [
      'add days', 'date', 'اضافة ايام', 'تاريخ قادم', 'بعد كم يوم', 'تاريخ مستقبلي',
      'زيادة ايام', 'مستقبل', 'موعد'
    ],
    fields: [
      { id: 'base_date', label: 'التاريخ المبدئي', placeholder: 'اختر التاريخ', type: 'date' },
      { id: 'days_to_add', label: 'عدد الأيام المراد إضافتها', placeholder: 'مثال: 45', unit: 'يوم' },
    ],
    resultPlaceholder: 'التاريخ الناتج واسم اليوم سيظهر هنا',
  },
  {
    id: 'subtract-days',
    name: 'Subtract Days from Date',
    nameAr: 'حاسبة طرح أيام من تاريخ',
    description: 'معرفة التاريخ السابق بعد خصم عدد من الأيام من تاريخ محدد',
    category: 'time_date',
    categoryAr: 'الوقت والتاريخ',
    iconName: 'CalendarMinus',
    defaultPopularity: 18,
    keywords: [
      'sub days', 'date', 'طرح ايام', 'خصم ايام', 'قبل كم يوم', 'تاريخ سابق', 'ماضي'
    ],
    fields: [
      { id: 'base_date', label: 'التاريخ المبدئي', placeholder: 'اختر التاريخ', type: 'date' },
      { id: 'days_to_sub', label: 'عدد الأيام المراد طرحها', placeholder: 'مثال: 30', unit: 'يوم' },
    ],
    resultPlaceholder: 'التاريخ السابق واسم اليوم سيظهر هنا',
  },
  {
    id: 'time-converter',
    name: 'Time Converter',
    nameAr: 'حاسبة تحويل الوقت',
    description: 'تحويل بين الساعات، الدقائق، الثواني، والأيام وفروق التوقيت',
    category: 'time_date',
    categoryAr: 'الوقت والتاريخ',
    iconName: 'Clock',
    defaultPopularity: 24,
    keywords: [
      'time', 'converter', 'وقت', 'الوقت', 'ساعة', 'دقائق', 'ثواني', 'تحويل الوقت',
      'ساعات', 'دقيقة', 'hours', 'minutes', 'seconds'
    ],
    fields: [
      { id: 'time_val', label: 'القيمة الزمنية', placeholder: 'أدخل القيمة' },
      { id: 'from_unit', label: 'من وحدة', placeholder: 'ساعات / دقائق / ثواني' },
      { id: 'to_unit', label: 'إلى وحدة', placeholder: 'ساعات / دقائق / ثواني' },
    ],
    resultPlaceholder: 'الزمن المحول بجميع الوحدات سيظهر هنا',
  },

  // ================= 5. الصحة (Health) =================
  {
    id: 'bmi',
    name: 'BMI Calculator',
    nameAr: 'حاسبة كتلة الجسم BMI',
    description: 'تقييم مؤشر كتلة الجسم وتحديد فئة الوزن الصحي',
    category: 'health',
    categoryAr: 'الصحة',
    iconName: 'HeartPulse',
    isQuick: true,
    defaultPopularity: 47,
    keywords: [
      'bmi', 'body mass', 'كتلة الجسم', 'مؤشر كتلة', 'سمنة', 'نحافة', 'وزن صحي',
      'طول ووزن', 'body', 'جسم', 'صحة', 'مؤشر السمنة'
    ],
    fields: [
      { id: 'weight', label: 'الوزن الحالي', placeholder: 'أدخل وزنك بالكيلوجرام', unit: 'كجم' },
      { id: 'height', label: 'الطول', placeholder: 'أدخل طولك بالسنتيمتر', unit: 'سم' },
    ],
    resultPlaceholder: 'مؤشر كتلة الجسم وتصنيف الوزن سيظهر هنا',
  },
  {
    id: 'daily-calories',
    name: 'Daily Calories',
    nameAr: 'حاسبة السعرات اليومية',
    description: 'حساب احتياج الجسم اليومي من السعرات الحرارية BMR و TDEE',
    category: 'health',
    categoryAr: 'الصحة',
    iconName: 'Flame',
    defaultPopularity: 44,
    keywords: [
      'calories', 'calorie', 'bmr', 'tdee', 'سعرات', 'السعرات', 'كالوري', 'حرق',
      'دايت', 'رجيم', 'طاقة', 'تغذية', 'diet', 'حرارية', 'تخسيس', 'تنحيف'
    ],
    fields: [
      { id: 'weight', label: 'الوزن', placeholder: 'أدخل الوزن', unit: 'كجم' },
      { id: 'height', label: 'الطول', placeholder: 'أدخل الطول', unit: 'سم' },
      { id: 'age', label: 'العمر', placeholder: 'أدخل عمرك', unit: 'سنة' },
      { id: 'gender', label: 'الجنس', placeholder: 'ذكر / أنثى' },
      { id: 'activity', label: 'مستوى النشاط البدني', placeholder: 'قليل / متوسط / عالي' },
    ],
    resultPlaceholder: 'السعرات اليومية للثبات وإنقاص أو زيادة الوزن ستظهر هنا',
  },
  {
    id: 'ideal-weight',
    name: 'Ideal Weight',
    nameAr: 'حاسبة الوزن المثالي',
    description: 'تقدير النطاق المثالي للوزن بناءً على الطول والهيكل الجسدي',
    category: 'health',
    categoryAr: 'الصحة',
    iconName: 'Scale',
    defaultPopularity: 38,
    keywords: [
      'ideal weight', 'وزن مثالي', 'الوزن المثالي', 'الوزن المناسب', 'افضل وزن',
      'وزن وطول', 'رشاقة', 'كم يجب ان يكون وزني'
    ],
    fields: [
      { id: 'height', label: 'الطول', placeholder: 'أدخل الطول', unit: 'سم' },
      { id: 'gender', label: 'الجنس', placeholder: 'ذكر / أنثى' },
    ],
    resultPlaceholder: 'نطاق الوزن المثالي الموصى به صحياً سيظهر هنا',
  },

  // ================= 6. الحياة اليومية (Daily Life) =================
  {
    id: 'monthly-expenses',
    name: 'Monthly Expenses',
    nameAr: 'حاسبة المصروف الشهري',
    description: 'توزيع الميزانية الشهرية وحساب المدخرات المتبقية',
    category: 'daily_life',
    categoryAr: 'الحياة اليومية',
    iconName: 'Wallet',
    defaultPopularity: 36,
    keywords: [
      'expense', 'budget', 'income', 'مصروف', 'المصروف', 'ميزانية', 'الميزانية',
      'راتب', 'دخل', 'توفير', 'ادخار', 'مصاريف', 'رواتب', 'مصاريفي'
    ],
    fields: [
      { id: 'monthly_income', label: 'إجمالي الدخل الشهري', placeholder: 'أدخل الراتب / الدخل', unit: 'د.ع' },
      { id: 'fixed_expenses', label: 'المصاريف الثابتة (إيجار، فواتير)', placeholder: 'أدخل مجموع الالتزامات', unit: 'د.ع' },
      { id: 'variable_expenses', label: 'المصاريف المتغيرة (تسوق، ترفيه)', placeholder: 'أدخل المصاريف التقديرية', unit: 'د.ع' },
    ],
    resultPlaceholder: 'صافي المتبقي ونسبة التوفير ستظهر هنا',
  },
  {
    id: 'electricity-consumption',
    name: 'Electricity Consumption',
    nameAr: 'حاسبة استهلاك الكهرباء',
    description: 'حساب تكلفة استهلاك الأجهزة الكهربائية وسعر الكيلوواط',
    category: 'daily_life',
    categoryAr: 'الحياة اليومية',
    iconName: 'Zap',
    defaultPopularity: 30,
    keywords: [
      'electricity', 'power', 'watt', 'kwh', 'كهرباء', 'الكهرباء', 'استهلاك', 'واط',
      'فاتورة الكهرباء', 'كيلوواط', 'امبير', 'طاقة', 'مولدة', 'امبيرات'
    ],
    fields: [
      { id: 'device_watt', label: 'قدرة الجهاز بالواط', placeholder: 'مثال: 1500', unit: 'Watt' },
      { id: 'daily_hours', label: 'ساعات التشغيل اليومية', placeholder: 'مثال: 8 ساعات', unit: 'ساعة' },
      { id: 'kwh_price', label: 'سعر الكيلوواط في الساعة', placeholder: 'مثال: 50', unit: 'د.ع' },
    ],
    resultPlaceholder: 'التكلفة اليومية والشهرية لاستهلاك الجهاز ستظهر هنا',
  },
  {
    id: 'room-area',
    name: 'Room Area',
    nameAr: 'حاسبة حساب المساحة',
    description: 'حساب مساحة الغرف والأراضي لحساب البلاط والدهانات',
    category: 'daily_life',
    categoryAr: 'الحياة اليومية',
    iconName: 'LayoutGrid',
    defaultPopularity: 25,
    keywords: [
      'room', 'tile', 'paint', 'غرفة', 'ارضية', 'بلاط', 'مساحة الغرفة', 'دهان',
      'صبغ', 'مساحة الارض', 'غرف', 'سيراميك'
    ],
    fields: [
      { id: 'length', label: 'الطول', placeholder: 'أدخل الطول', unit: 'متر' },
      { id: 'width', label: 'العرض', placeholder: 'أدخل العرض', unit: 'متر' },
    ],
    resultPlaceholder: 'المساحة الكلية والمحيط سيظهر هنا',
  },
  {
    id: 'tank-volume',
    name: 'Tank Volume',
    nameAr: 'حاسبة حساب الحجم والسعة',
    description: 'حساب سعة الخزانات والأحواض باللتر والمتر المكعب',
    category: 'daily_life',
    categoryAr: 'الحياة اليومية',
    iconName: 'Boxes',
    defaultPopularity: 22,
    keywords: [
      'tank', 'water', 'خزان', 'الخزان', 'سعة الخزان', 'ماء', 'برميل', 'حوض',
      'لترات', 'مياه', 'تانكي'
    ],
    fields: [
      { id: 'length', label: 'الطول', placeholder: 'أدخل الطول', unit: 'متر' },
      { id: 'width', label: 'العرض', placeholder: 'أدخل العرض', unit: 'متر' },
      { id: 'height', label: 'الارتفاع / العمق', placeholder: 'أدخل الارتفاع', unit: 'متر' },
    ],
    resultPlaceholder: 'السعة الإجمالية باللتر والمتر المكعب ستظهر هنا',
  },
];
