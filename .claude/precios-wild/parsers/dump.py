import sys, openpyxl
wb=openpyxl.load_workbook(sys.argv[1],data_only=True)
lim=int(sys.argv[2])
for ws in wb.worksheets:
    print("=== SHEET",ws.title,ws.max_row,ws.max_column)
    for i,r in enumerate(ws.iter_rows(values_only=True)):
        if i>=lim: break
        if any(c is not None for c in r): print(i+1,[c for c in r])
