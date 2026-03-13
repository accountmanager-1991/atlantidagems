import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, BorderStyle,
  WidthType, ShadingType, TableLayoutType
} from "docx";
import { writeFileSync } from "fs";

const BRAND_BLUE = "1A7A9E";
const BRAND_GOLD = "C9A84C";
const LIGHT_BLUE = "E8F4F8";
const LIGHT_GOLD = "FDF8EE";
const WHITE = "FFFFFF";

const heading2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: BRAND_BLUE })],
  spacing: { before: 360, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: BRAND_GOLD } }
});

const heading3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 22, color: "333333" })],
  spacing: { before: 280, after: 120 }
});

const body = (text) => new Paragraph({
  children: [new TextRun({ text, size: 20, color: "333333" })],
  spacing: { after: 120 },
  alignment: AlignmentType.JUSTIFIED
});

const bullet = (text, bold_part = null) => new Paragraph({
  children: bold_part
    ? [new TextRun({ text: bold_part + " ", bold: true, size: 20, color: "333333" }),
       new TextRun({ text, size: 20, color: "555555" })]
    : [new TextRun({ text, size: 20, color: "555555" })],
  bullet: { level: 0 },
  spacing: { after: 80 }
});

const spacer = () => new Paragraph({ text: "", spacing: { after: 160 } });

const tableCell = (text, { bold = false, bg = WHITE, color = "333333", align = AlignmentType.LEFT, size = 18 } = {}) =>
  new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size, color })],
      alignment: align,
      spacing: { before: 80, after: 80 }
    })],
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });

const headerCell = (text) => tableCell(text, { bold: true, bg: BRAND_BLUE, color: WHITE, align: AlignmentType.CENTER });
const altCell = (text, isAlt) => tableCell(text, { bg: isAlt ? LIGHT_BLUE : WHITE });

const doc = new Document({
  creator: "Ambar & Larimar Shop",
  title: "Caja de Suscripción de Joyería — Análisis de Mercado",
  description: "Análisis completo de mercado y estrategia de precios para el servicio de suscripción de Ambar & Larimar Shop",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 20 } }
    }
  },
  sections: [{
    properties: {
      page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } }
    },
    children: [

      // ── PORTADA ──
      new Paragraph({
        children: [new TextRun({ text: "AMBAR & LARIMAR SHOP", bold: true, size: 48, color: BRAND_BLUE })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 800, after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Caja de Suscripción de Joyería", size: 36, color: BRAND_GOLD, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Análisis de Mercado y Estrategia de Precios", size: 26, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Marzo 2026  ·  Confidencial", size: 20, color: "999999" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 }
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_GOLD } },
        spacing: { after: 600 }
      }),

      // ── 1. RESUMEN EJECUTIVO ──
      heading2("1. Resumen Ejecutivo"),
      spacer(),
      body("Ambar & Larimar Shop está posicionada de manera única para lanzar la única caja de suscripción de joyería fina del Caribe auténtica en los mercados de EE.UU., Canadá y Alemania. Con una capacidad de producción mensual de 3,000 unidades, propiedad vertical de la cadena de suministro y acceso exclusivo a dos de las piedras preciosas más raras del mundo — Larimar y Ámbar Azul Dominicano — el modelo de suscripción representa una oportunidad de ingresos recurrentes de alto margen adicional a la tienda minorista existente."),
      spacer(),
      body("Este análisis cubre la estructura de costos de producción, perfiles de clientes ideales, panorama competitivo, niveles de precios recomendados y proyecciones de ingresos con 3,000 suscriptores."),
      spacer(),

      // ── 2. ESTRUCTURA DE COSTOS ──
      heading2("2. Estructura de Costos de Producción"),
      spacer(),
      body("El costo por caja varía significativamente según los materiales y la complejidad de la mano de obra. La tabla a continuación refleja el rango realista entre las cuatro opciones mensuales planificadas."),
      spacer(),

      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell("Componente"), headerCell("Mínimo"), headerCell("Máximo"), headerCell("Estimado Promedio")] }),
          new TableRow({ children: [altCell("Materiales (2–3 piezas)", true), altCell("$6", true), altCell("$15", true), altCell("$10", true)] }),
          new TableRow({ children: [altCell("Mano de obra (2–3 piezas)", false), altCell("$10", false), altCell("$90", false), altCell("$35", false)] }),
          new TableRow({ children: [altCell("Empaque", true), altCell("$3", true), altCell("$8", true), altCell("$5", true)] }),
          new TableRow({ children: [altCell("Envío internacional", false), altCell("$10", false), altCell("$22", false), altCell("$15", false)] }),
          new TableRow({
            children: [
              tableCell("COSTO TOTAL / CAJA", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$29", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$135", { bold: true, bg: LIGHT_GOLD }),
              tableCell("~$65", { bold: true, bg: LIGHT_GOLD })
            ]
          })
        ]
      }),
      spacer(),
      body("⚠  Punto Clave: La mano de obra es la variable de costo más grande ($5–$30 por pieza). Con 750 cajas por opción, una diferencia de $25 en mano de obra equivale a $18,750 por SKU. Es crítico estandarizar el costo de mano de obra por nivel antes de fijar los precios finales."),
      spacer(),

      // ── 3. CLIENTE IDEAL ──
      heading2("3. Perfiles de Cliente Ideal"),
      spacer(),

      heading3("Perfil Principal: La Coleccionista de Piezas Únicas"),
      bullet("Mujeres, entre 32 y 52 años, en EE.UU., Canadá y Alemania", "¿Quién?"),
      bullet("Ingresos del hogar de $75,000–$160,000 USD", "Ingresos:"),
      bullet("Viajera, colecciona piezas con significado, evita usar lo que todos usan", "Personalidad:"),
      bullet("Poseer algo genuinamente raro con una historia de origen real", "Motivación:"),
      bullet("\"Esta piedra solo existe en un lugar en toda la Tierra\"", "Detonador de compra:"),
      spacer(),

      heading3("Perfil Secundario: El Comprador de Regalos"),
      bullet("Hombres de 30–55 años, comprando para esposas, madres o novias", "¿Quién?"),
      bullet("Quiere regalar algo impresionante y significativo sin conocer de joyería", "Motivación:"),
      bullet("Día de las Madres, San Valentín, aniversarios, cumpleaños", "Detonador de compra:"),
      bullet("Mayor valor de vida — típicamente suscribe por 6–12 meses como regalo", "Valor:"),
      spacer(),

      heading3("La Oportunidad en el Mercado Alemán"),
      body("Los consumidores alemanes responden muy bien a la autenticidad, el Handwerk (artesanía), el origen verificado y la escasez. El mensaje 'El Larimar existe solo en una montaña en la República Dominicana' es un posicionamiento premium que resuena profundamente con el comprador alemán de bienes de lujo. Alemania debe tratarse como un mercado de contenido separado con precios en EUR y mensajes enfocados en el origen."),
      spacer(),

      // ── 4. PANORAMA COMPETITIVO ──
      heading2("4. Panorama Competitivo"),
      spacer(),

      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell("Competidor"), headerCell("Precio/mes"), headerCell("Modelo"), headerCell("Su Debilidad")] }),
          new TableRow({ children: [altCell("Rocksbox", true), altCell("$21", true), altCell("Alquiler (no son tuyos)", true), altCell("Sin propiedad, calidad básica", true)] }),
          new TableRow({ children: [altCell("Nadine West", false), altCell("$9–$35", false), altCell("Conservar, gama baja", false), altCell("Producción masiva, sin historia", false)] }),
          new TableRow({ children: [altCell("Menagerie", true), altCell("$35–$50", true), altCell("Cristales en bruto", true), altCell("No es joyería portable", true)] }),
          new TableRow({ children: [altCell("Gem & Jewel", false), altCell("$45–$75", false), altCell("Conservar, gama media", false), altCell("Sin piedra diferenciadora", false)] }),
          new TableRow({
            children: [
              tableCell("Ambar & Larimar Shop", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$69–$119", { bold: true, bg: LIGHT_GOLD }),
              tableCell("Conservar, joyería fina", { bold: true, bg: LIGHT_GOLD }),
              tableCell("Ninguna — única fuente auténtica de Larimar y Ámbar Dominicano", { bold: true, bg: LIGHT_GOLD })
            ]
          })
        ]
      }),
      spacer(),
      body("Ningún competidor ofrece Larimar auténtico. El Larimar se extrae exclusivamente en Barahona, República Dominicana, de un único yacimiento. Combinado con el Ámbar Azul Dominicano — una de las variedades de ámbar más raras del mundo — esta es una ventaja competitiva que ningún competidor puede replicar, franquiciar ni producir en masa."),
      spacer(),

      // ── 5. PLANES Y PRECIOS ──
      heading2("5. Planes de Suscripción Recomendados"),
      spacer(),
      body("Las cuatro opciones de producción mensual se mapean de forma limpia en cuatro niveles de suscripción, cada uno orientado a un segmento de cliente y sensibilidad de precio diferente."),
      spacer(),

      heading3("Plan A — Larimar Plata  ·  $69/mes"),
      bullet("2 piezas: plata de ley + larimar (aretes + colgante o anillo)", "Contenido:"),
      bullet("Enfoque en una sola piedra — Larimar como protagonista", "Temática:"),
      bullet("Costo estimado $38–$48 → margen bruto del 30–45%", "Economía:"),
      bullet("Plan de entrada, ideal para nuevos suscriptores y compradores de regalos", "Segmento:"),
      spacer(),

      heading3("Plan B — Ámbar Plata  ·  $69/mes"),
      bullet("2 piezas: plata de ley + Ámbar Azul Dominicano", "Contenido:"),
      bullet("Mismo precio que el Plan A, preferencia de piedra diferente", "Temática:"),
      bullet("Costo estimado $35–$45 → margen bruto del 35–49%", "Economía:"),
      bullet("Para clientes que prefieren tonos cálidos sobre los azules oceánicos", "Segmento:"),
      spacer(),

      heading3("Plan C — Mezcla Caribeña  ·  $89/mes  ★ ANCLA"),
      bullet("3 piezas: combinación Larimar + Ámbar en plata de ley", "Contenido:"),
      bullet("Mejor percepción de valor — 3 piezas, ambas piedras, por menos de $100", "Temática:"),
      bullet("Costo estimado $52–$68 → margen bruto del 24–42%", "Economía:"),
      bullet("Plan principal recomendado — mayor conversión esperada", "Segmento:"),
      spacer(),

      heading3("Plan D — Edición Oro  ·  $119/mes"),
      bullet("3 piezas: monturas en oro o chapado en oro, piedras premium", "Contenido:"),
      bullet("Caja exclusiva, empaque premium, certificado de autenticidad", "Temática:"),
      bullet("Costo estimado $65–$95 → margen bruto del 20–45%", "Economía:"),
      bullet("Segmento de lujo, coleccionistas, regalos corporativos", "Segmento:"),
      spacer(),

      body("💡 Recomendación de Lanzamiento: Lanzar solo con los Planes A, C y D. El Plan B (solo Ámbar) puede introducirse en el mes 2 o 3 una vez que la historia del Larimar esté establecida. El Larimar es tu titular — ancla todo el marketing en él primero."),
      spacer(),

      // ── 6. PROYECCIONES ──
      heading2("6. Proyecciones de Ingresos con 3,000 Suscriptores"),
      spacer(),
      body("Distribución de suscriptores asumida: 30% Plan A/B, 40% Plan C (Mezcla Caribeña), 30% Plan D (Edición Oro)."),
      spacer(),

      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [headerCell("Métrica"), headerCell("Conservador"), headerCell("Objetivo")] }),
          new TableRow({ children: [altCell("Ingreso promedio / suscriptor", true), altCell("$82", true), altCell("$89", true)] }),
          new TableRow({ children: [altCell("Ingresos brutos mensuales", false), altCell("$246,000", false), altCell("$267,000", false)] }),
          new TableRow({ children: [altCell("Costo estimado mensual (COGS)", true), altCell("$147,000", true), altCell("$165,000", true)] }),
          new TableRow({
            children: [
              tableCell("Ganancia bruta / mes", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$99,000", { bold: true, bg: LIGHT_GOLD }),
              tableCell("$102,000", { bold: true, bg: LIGHT_GOLD })
            ]
          }),
          new TableRow({
            children: [
              tableCell("Ganancia bruta anual", { bold: true, bg: LIGHT_GOLD }),
              tableCell("~$1,188,000", { bold: true, bg: LIGHT_GOLD }),
              tableCell("~$1,224,000", { bold: true, bg: LIGHT_GOLD })
            ]
          })
        ]
      }),
      spacer(),
      body("Estas proyecciones son adicionales a los ingresos de la tienda regular (compras individuales). El modelo de suscripción genera flujo de caja recurrente y predecible que permite financiar la producción de inventario por adelantado cada mes."),
      spacer(),

      // ── 7. RIESGOS ──
      heading2("7. Riesgos Clave y Mitigación"),
      spacer(),

      heading3("Riesgo 1 — Cancelación de Suscriptores (Churn)"),
      body("Las cajas de suscripción de joyería promedian entre un 6% y 9% de cancelaciones mensuales. Con 3,000 suscriptores, eso representa entre 180 y 270 cancelaciones cada mes. Se necesita un motor de adquisición constante solo para mantener el número de suscriptores estable. Mitigación: activar el pipeline de automatización de redes sociales en n8n (2–3 publicaciones/día) y anuncios de Etsy antes o al momento del lanzamiento."),
      spacer(),

      heading3("Riesgo 2 — Variación del Costo de Mano de Obra a Escala"),
      body("El costo de mano de obra varía entre $5 y $30 por pieza. Con 750 cajas por opción, una diferencia de $25 por pieza equivale a $18,750 por SKU por mes en costos no planificados. Mitigación: definir un costo fijo de mano de obra por nivel antes de establecer precios, y aplicarlo en los contratos de producción con el taller."),
      spacer(),

      heading3("Riesgo 3 — Envío Internacional desde RD"),
      body("El envío directo desde la República Dominicana a EE.UU., Canadá y Alemania conlleva riesgos aduaneros, retrasos y costos variables. Mitigación: evaluar un centro de fulfillment en EE.UU. (ej. ShipBob, Pirateship) donde se envíe inventario a granel mensualmente y ellos gestionen el envío individual a cada suscriptor. Esto puede reducir el costo por caja de ~$18 a ~$8 y mejorar significativamente los tiempos de entrega."),
      spacer(),

      heading3("Riesgo 4 — Consistencia de Calidad"),
      body("El Larimar y el Ámbar naturales tienen variación inherente. Con 3,000 cajas al mes, los suscriptores pueden recibir piezas que se vean significativamente diferentes a las fotos de marketing. Mitigación: establecer un sistema claro de clasificación de calidad, fotografiar el inventario mensual real para el marketing y comunicar a los suscriptores que la variación natural es parte de la autenticidad del producto."),
      spacer(),

      // ── 8. IR AL MERCADO ──
      heading2("8. Prioridades de Salida al Mercado"),
      spacer(),
      bullet("Anclar todo el mensaje en la escasez: 'Solo se encuentra en un lugar en la Tierra'", "1."),
      bullet("Establecer el Plan C ($89/mes Mezcla Caribeña) como el plan destacado en todo el marketing", "2."),
      bullet("Establecer alianza de fulfillment en EE.UU. antes del lanzamiento para resolver el envío", "3."),
      bullet("Activar el pipeline social de n8n (Instagram, Pinterest, TikTok) 60 días antes del lanzamiento", "4."),
      bullet("Ejecutar campañas de Día de las Madres y San Valentín como principales eventos de adquisición", "5."),
      bullet("Alemania: precio en EUR (€69/€89/€119), traducir historia de origen, segmentar vía Meta y Google", "6."),
      bullet("Integrar la opción de suscripción directamente en el sitio web existente — checkout sin fricción", "7."),
      spacer(),
      spacer(),

      // ── PIE DE PÁGINA ──
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: BRAND_GOLD } },
        spacing: { before: 400, after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Ambar & Larimar Shop  ·  Emozca LLC  ·  Confidencial  ·  Marzo 2026", size: 16, color: "999999" })],
        alignment: AlignmentType.CENTER
      }),
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("Ambar-Larimar-Analisis-de-Mercado-ES.docx", buffer);
console.log("✅ Documento creado: Ambar-Larimar-Analisis-de-Mercado-ES.docx");
