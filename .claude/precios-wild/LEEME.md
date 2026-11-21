# Referente de precios Wild4x4

- Página: https://claude.ai/artifact/W9KZ9Zv1Lgr5kyYSLWzdbQ (base de datos: colección `proveedores`, un documento por proveedor).
- Documento por proveedor: nombre, tipo (web | lista | sin-datos), fuente, archivo, actualizado (AAAA-MM-DD), nota, items[].
- Ítem (claves cortas): s=SKU, n=nombre, v=variante, p=precio, t=transferencia, i=sin impuestos, a=precio anterior (oferta), k=stock, u=ruta del producto.
- Big Toys: `bigtoys_scrape.py` (necesita `bt/sitemap.xml` de https://www.big-toys.com.ar/sitemap.xml y el host permitido en la red). Luego convertir a ítems y hacer `set` del documento `big-toys`.
