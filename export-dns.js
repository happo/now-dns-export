const { execSync } = require('child_process');

const domain = process.argv[2];
if (!domain) {
  console.error('Missing domain. Usage: node export-dns.js <domain>');
  process.exit(1);
}
const entries = execSync(`now dns ls ${domain}`, { encoding: 'utf-8' });

entries.split('\n').forEach((entry) => {
  if (!/^\s*rec_/.test(entry)) {
    return;
  }

  const t = entry.replace(/[0-9]+d ago/, '').split(/\s{2,}/);
  //console.log(t);

  if (t[2] === 'MX') {
    // @ 10800 IN MX 50 fb.mail.gandi.net.
    console.log(`@ 10800 IN MX ${t[3]} ${t[4]}`)
  }
  if (t[3] === 'TXT') {
    // @ 10800 IN TXT "v=spf1 include:_mailcust.gandi.net ?all"
    console.log(`${t[2]} 10800 IN TXT "${t[4]}"`)
  }
  if (t[3] === 'CNAME') {
    // webmail 10800 IN CNAME webmail.gandi.net.
    console.log(`${t[2]} 10800 IN CNAME ${t[4]}`)
  }
  if (t[3] === 'A') {
    // subdomain 10800 IN A 217.70.184.38
    console.log(`${t[2]} 10800 IN A ${t[4]}`)
  }
  if (t[2] === 'A') {
    // @ 10800 IN A 217.70.184.38
    console.log(`@ 10800 IN A ${t[3]}`)
  }
});
