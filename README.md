# Haitham Basim - CV

Online version: https://haithambasim.github.io/cv/

| Path | What it is |
|---|---|
| `index.html`, `fonts/` | The page that GitHub Pages serves |
| `Haitham-Basim-CV.pdf` | The printable version, linked from the page |
| `tools/` | The scripts that generate the Word document, the PDF and the page |

## Changing the CV

All the text lives in one place: the `cv` object at the top of `tools/build_cv.js`. The Word document, the PDF and
the page are generated from it, so they always say the same thing. Edit the text there, then rebuild:

```bash
cd tools
npm install
node build_cv.js      # writes out/Haitham-Basim-CV-2026.docx
soffice --headless --convert-to pdf --outdir out out/Haitham-Basim-CV-2026.docx
node build_site.js    # writes ../index.html and ../fonts
cp out/Haitham-Basim-CV-2026.pdf ../Haitham-Basim-CV.pdf
```

`soffice` is LibreOffice. `tools/out/` is not committed.

The QR code in the PDF's header opens the page. Its address is `SITE_URL` in `tools/build_cv.js`, so renaming this
repository breaks every printed copy.

## Checking the result

```bash
python render_pdf.py out/Haitham-Basim-CV-2026.pdf out/page   # one image per page, prints the page count
python crop_qr.py out/Haitham-Basim-CV-2026.pdf out/qr        # cuts every QR code out of the PDF
node decode_qr.js out/qr                                      # prints each code's address, fails if one cannot be read
node shot.js .. out/site                                      # desktop and phone screenshots of the page
```

The Python scripts need PyMuPDF (`pip install pymupdf`). `shot.js` needs Playwright, which is not installed by
`npm install`: install it, or set `PLAYWRIGHT_PATH` to an existing copy.
