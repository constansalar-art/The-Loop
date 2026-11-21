import sys, openpyxl
wb=openpyxl.load_workbook(sys.argv[1],data_only=True)
ws=wb.worksheets[0]
a,b=int(sys.argv[2]),int(sys.argv[3])
for i,r in enumerate(ws.iter_rows(min_row=a,max_row=b,values_only=True),start=a):
    d={j:c for j,c in enumerate(r) if c is not None and str(c)!='00:00:00'}
    if d: print(i,d)
