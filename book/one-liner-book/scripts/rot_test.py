import pymupdf, sys
src = sys.argv[1]
pix = pymupdf.Pixmap(src)
# render rotated via a temporary PDF page
doc = pymupdf.open(); page = doc.new_page(width=pix.width, height=pix.height)
page.insert_image(page.rect, filename=src, rotate=int(sys.argv[2]))
page.get_pixmap(dpi=36).save(sys.argv[3])
