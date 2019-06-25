const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const Table = require('cli-table');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let db = new sqlite3.Database('university.db', err => {
  if (err) {
    return console.error(err.message);
  }
  // console.log('Connected to the in-memory SQlite database.');
});

let message = `silakan pilih opsi di bawah ini
[1] Mahasiswa
[2] Jurusan
[3] Dosen
[4] Mata Kuliah
[5] Kontrak
[6] Keluar`;

const firstQuestion = () => {
  return new Promise((resolve, reject) => {
    console.log('====================================================');
    console.log(message);
    console.log('====================================================');
    firstAnswer();
    resolve();
  });
};

const firstAnswer = () => {
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        mahasiswaField();
        break;

      default:
        break;
    }
  });
};

const mahasiswaField = () => {
  message = `silakan pilih opsi di bawah ini
[1] Daftar Murid
[2] Cari Murid
[3] Tambah Murid
[4] Hapus Murid
[5] Kembali`;

  console.log('====================================================');
  console.log(message);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarMurid();
        break;

      case '2':
        cariMurid();
        break;

      default:
        break;
    }
  });
};

const daftarMurid = () => {
  let sql = `SELECT nim, nama, alamat, jurusan FROM mahasiswas`;

  db.all(sql, [], (err, rows) => {
    if (err) throw err;

    let table = new Table({
      head: ['NIM', 'Nama', 'Alamat', 'Jurusan'],
      colWidths: [15, 25, 15, 15]
    });

    rows.forEach(row => {
      table.push( [row.nim, row.nama, row.alamat, row.jurusan] );
    });
    
    console.log('====================================================');
    console.log(table.toString());
    mahasiswaField();
  });
};

const cariMurid = () => {
  console.log('====================================================');
  return rl.question('Masukkan NIM: ', answer => {
    let sql = `SELECT nim, nama, alamat, jurusan FROM mahasiswas WHERE mahasiswas.nim = ?`;
    let nim = answer;

    db.all(sql, [nim], (err, row) => {
      if (err) throw err;

      if (row.length > 0) {
        console.log('====================================================');
        console.log(`id       : ${row[0].nim}`);
        console.log(`nama     : ${row[0].nama}`);
        console.log(`alamat   : ${row[0].alamat}`);
        console.log(`jurusan  : ${row[0].jurusan}`);
        console.log('====================================================');
      } else {
        console.log(`mahasiswa dengan nim ${nim} tidak terdaftar`);
        console.log('====================================================');
      }
      mahasiswaField();
    });
  });
};

const main = async () => {
  await firstQuestion();
};

main();
