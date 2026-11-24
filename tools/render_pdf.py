"""Render each page of a PDF to a PNG next to it and print the page count."""
import sys

import fitz  # PyMuPDF


def main(pdf_path, out_prefix):
    doc = fitz.open(pdf_path)
    print("pages:", doc.page_count)
    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(dpi=110)
        target = "%s-%d.png" % (out_prefix, i)
        pix.save(target)
        words = len(page.get_text("words"))
        print(target, "words:", words)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
