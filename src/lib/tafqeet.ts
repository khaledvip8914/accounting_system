export function tafqeet(num: number): string {
  if (num === 0) return 'صفر ريال سعودي لا غير';
  
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
  const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];

  function convertGroup(n: number): string {
    if (n === 0) return "";
    let str = "";
    
    const h = Math.floor(n / 100);
    const remainder = n % 100;
    const t = Math.floor(remainder / 10);
    const o = remainder % 10;
    
    if (h > 0) {
      str += hundreds[h];
      if (remainder > 0) str += " و ";
    }
    
    if (remainder >= 10 && remainder <= 19) {
      str += teens[remainder - 10];
    } else {
      if (o > 0) {
        str += ones[o];
        if (t > 0) str += " و ";
      }
      if (t >= 2) {
        str += tens[t];
      } else if (t === 1) { // 10
        str += tens[1];
      }
    }
    return str;
  }

  const intPart = Math.floor(num);
  let decPart = Math.round((num - intPart) * 100);

  let parts = [];
  let numStr = intPart.toString().padStart(12, "0");

  const billions = parseInt(numStr.substring(0, 3));
  const millions = parseInt(numStr.substring(3, 6));
  const thousands = parseInt(numStr.substring(6, 9));
  const units = parseInt(numStr.substring(9, 12));

  if (billions > 0) {
    if (billions === 1) parts.push("مليار");
    else if (billions === 2) parts.push("ملياران");
    else if (billions >= 3 && billions <= 10) parts.push(convertGroup(billions) + " مليارات");
    else parts.push(convertGroup(billions) + " مليار");
  }

  if (millions > 0) {
    if (millions === 1) parts.push("مليون");
    else if (millions === 2) parts.push("مليونان");
    else if (millions >= 3 && millions <= 10) parts.push(convertGroup(millions) + " ملايين");
    else parts.push(convertGroup(millions) + " مليون");
  }

  if (thousands > 0) {
    if (thousands === 1) parts.push("ألف");
    else if (thousands === 2) parts.push("ألفان");
    else if (thousands >= 3 && thousands <= 10) parts.push(convertGroup(thousands) + " آلاف");
    else parts.push(convertGroup(thousands) + " ألف");
  }

  if (units > 0) {
    parts.push(convertGroup(units));
  }

  let result = "فقط " + (parts.length > 0 ? parts.join(" و ") : "صفر") + " ريال سعودي";
  if (decPart > 0) {
    result += " و " + convertGroup(decPart) + " هللة";
  }
  return result + " لا غير";
}
