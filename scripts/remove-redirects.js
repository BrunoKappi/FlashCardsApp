import fs from "fs";

if (fs.existsSync("public/_redirects")) {
  fs.unlinkSync("public/_redirects");
}
