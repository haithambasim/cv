"""Crop every image placed in a PDF (as rendered on the page) into its own PNG, for QR decoding."""
import os
import sys

import fitz  # PyMuPDF


def main(pdf_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    count = 0
    for page_number, page in enumerate(doc, start=1):
        for image in page.get_images(full=True):
            for rect in page.get_image_rects(image[0]):
                count += 1
                clip = rect + (-6, -6, 6, 6)  # keep some white margin around the code
                pix = page.get_pixmap(clip=clip, dpi=300, alpha=False)
                pix.save(os.path.join(out_dir, "qr-%02d.png" % count))
                print("qr-%02d page %d size %.2f cm" % (count, page_number, rect.width / 72 * 2.54))
    print("images:", count)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
