# Referente de precios Wild4x4

- Página: https://claude.ai/artifact/W9KZ9Zv1Lgr5kyYSLWzdbQ (base de datos: colección `proveedores`, un documento por proveedor).
- Documento por proveedor: nombre, tipo (web | lista | sin-datos), fuente, archivo, actualizado (AAAA-MM-DD), nota, items[].
- Ítem (claves cortas): s=SKU, n=nombre, v=variante, p=precio, t=transferencia, i=sin impuestos, a=precio anterior (oferta), k=stock, u=ruta del producto.
- Big Toys: `bigtoys_scrape.py` (necesita `bt/sitemap.xml` de https://www.big-toys.com.ar/sitemap.xml y el host permitido en la red). Luego convertir a ítems y hacer `set` del documento `big-toys`.
- Rhino4x4: lista PDF "Valores <MES> <AÑO>.pdf" -> `pdftotext -layout lista.pdf v.txt && python3 rhino_lista_pdf.py v.txt items.json` (sin códigos; IVA incluido).
- Regla de fechas: `actualizado` = fecha impresa dentro de la lista (o día del relevamiento web). Si la lista no trae fecha: `actualizado` null y `fecha_archivo` + `fecha_archivo_origen` aparte.
- Regla de moneda: los precios en USD se guardan en USD (`moneda` del proveedor o `mon` por ítem). Nunca convertir a pesos: el tipo de cambio es del día.
- MUG4x4: CSV exportado del portal con Claude in Chrome (columnas codigo, descripcion, precio_lista, mi_precio, moneda, stock). Precio = mi_precio (lista -20%), Otro precio = precio_lista, actualizado = día del relevamiento.
