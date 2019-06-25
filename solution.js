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
});

const firstQuestion = () => {
  return new Promise((resolve, reject) => {
    console.log('====================================================');
    console.log(`silakan pilih opsi di bawah ini
[1] Mahasiswa
[2] Jurusan
[3] Dosen
[4] Mata Kuliah
[5] Kontrak
[6] Keluar`);
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

      case '2':
        jurusanField();
        break;
        
      case '3':
        dosenField();
        break;

      default:
        firstAnswer();
        break;
    }
  });
};

const mahasiswaField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Murid
[2] Cari Murid
[3] Tambah Murid
[4] Hapus Murid
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarMurid();
        break;

      case '2':
        cariMurid();
        break;

      case '3':
        tambahMurid();
        break;

      case '4':
        hapusMurid();
        break;

      case '5':
        kembali();
        break;

      default:
        mahasiswaField();
        break;
    }
  });
};

const daftarMurid = () => {
  const sql = `SELECT nim, nama, alamat, jurusan FROM mahasiswas`;

  return db.all(sql, [], (err, rows) => {
    if (err) throw err;

    const table = new Table({
      head: ['NIM', 'Nama', 'Alamat', 'Jurusan'],
      colWidths: [10, 25, 15, 10]
    });

    rows.forEach(row => {
      table.push([row.nim, row.nama, row.alamat, row.jurusan]);
    });

    console.log('====================================================');
    console.log(table.toString());
    mahasiswaField();
  });
};

const cariMurid = () => {
  console.log('====================================================');
  return rl.question('Masukkan NIM: ', answer => {
    const sql = `SELECT nim, nama, alamat, jurusan FROM mahasiswas WHERE mahasiswas.nim = ?`;
    const nim = answer;

    db.all(sql, [nim], (err, row) => {
      if (err) throw err;

      if (row.length > 0) {
        console.log('====================================================');
        console.log('student details');
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

const tambahMurid = () => {
  console.log('====================================================');
  console.log('lengkapi data di bawah ini:');
  const dataMurid = [];
  return rl.question('NIM: ', nim => {
    dataMurid[0] = nim;
    rl.question('nama: ', nama => {
      dataMurid[1] = nama;
      rl.question('alamat: ', alamat => {
        dataMurid[2] = alamat;
        rl.question('jurusan: ', jurusan => {
          dataMurid[3] = jurusan;
          rl.question('umur: ', umur => {
            dataMurid[4] = Number(umur);
            const sql = `INSERT INTO mahasiswas(nim, nama, alamat, jurusan, umur) VALUES(?, ?, ?, ?, ?)`;

            db.run(sql, dataMurid, err => {
              if (err) throw err;

              daftarMurid();
            });
          });
        });
      });
    });
  });
};

const hapusMurid = () => {
  console.log('====================================================');
  return rl.question('masukkan NIM mahasiswa yang akan dihapus: ', answer => {
    const nim = answer;
    const sql = `DELETE FROM mahasiswas WHERE nim = ?`;

    db.run(sql, nim, err => {
      if (err) throw err;

      daftarMurid();
    });
  });
};

const jurusanField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Jurusan
[2] Cari Jurusan
[3] Tambah Jurusan
[4] Hapus Jurusan
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarJurusan();
        break;

      case '2':
        cariJurusan();
        break;

      case '3':
        tambahJurusan();
        break;

      case '4':
        hapusJurusan();
        break;

      case '5':
        kembali();
        break;

      default:
        jurusanField();
        break;
    }
  });
};

const daftarJurusan = () => {
  const sql = `SELECT jurusanId, namajurusan FROM jurusans`;

  return db.all(sql, [], (err, rows) => {
    if (err) throw err;

    const table = new Table({
      head: ['ID', 'Nama Jurusan'],
      colWidths: [10, 25]
    });

    rows.forEach(row => {
      table.push([row.jurusanId, row.namajurusan]);
    });

    console.log('====================================================');
    console.log(table.toString());
    jurusanField();
  });
};

const cariJurusan = () => {
  console.log('====================================================');
  return rl.question('Masukkan ID Jurusan: ', answer => {
    const sql = `SELECT jurusanId, namajurusan FROM jurusans WHERE jurusans.jurusanId = ?`;
    const idJur = answer;

    db.all(sql, [idJur], (err, row) => {
      if (err) throw err;

      if (row.length > 0) {
        console.log('====================================================');
        console.log('Jurusan details');
        console.log('====================================================');
        console.log(`id       : ${row[0].jurusanId}`);
        console.log(`jurusan  : ${row[0].namajurusan}`);
        console.log('====================================================');
      } else {
        console.log(`jurusan dengan id ${idJur} tidak terdaftar`);
        console.log('====================================================');
      }
      jurusanField();
    });
  });
};

const tambahJurusan = () => {
  console.log('====================================================');
  console.log('lengkapi data di bawah ini:');
  const dataJurusan = [];
  return rl.question('ID: ', jurusanId => {
    dataJurusan[0] = jurusanId;
    rl.question('jurusan: ', namajurusan => {
      dataJurusan[1] = namajurusan;
      const sql = `INSERT INTO jurusans(jurusanId, namajurusan) VALUES(?, ?)`;

      db.run(sql, dataJurusan, err => {
        if (err) throw err;

        daftarJurusan();
      });
    });
  });
};

const hapusJurusan = () => {
  console.log('====================================================');
  return rl.question('masukkan ID jurusan yang akan dihapus: ', answer => {
    const jurusanId = answer;
    const sql = `DELETE FROM jurusans WHERE jurusanId = ?`;

    db.run(sql, jurusanId, err => {
      if (err) throw err;

      daftarJurusan();
    });
  });
};

const dosenField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Dosen
[2] Cari Dosen
[3] Tambah Dosen
[4] Hapus Dosen
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarDosen();
        break;

      case '2':
        cariDosen();
        break;

      case '3':
        tambahDosen();
        break;

      case '4':
        hapusDosen();
        break;

      case '5':
        kembali();
        break;

      default:
        dosenField();
        break;
    }
  });
};

const daftarDosen = () => {
  const sql = `SELECT nip, namadosen FROM dosens`;

  return db.all(sql, [], (err, rows) => {
    if (err) throw err;

    const table = new Table({
      head: ['ID', 'Nama'],
      colWidths: [10, 25]
    });

    rows.forEach(row => {
      table.push([row.nip, row.namadosen]);
    });

    console.log('====================================================');
    console.log(table.toString());
    dosenField();
  });
};

const cariDosen = () => {
  console.log('====================================================');
  return rl.question('Masukkan NIM: ', answer => {
    const sql = `SELECT nip, namadosen FROM dosens WHERE dosens.nip = ?`;
    const nip = answer;

    db.all(sql, [nip], (err, row) => {
      if (err) throw err;

      if (row.length > 0) {
        console.log('====================================================');
        console.log('dosen details');
        console.log('====================================================');
        console.log(`nip      : ${row[0].nip}`);
        console.log(`nama     : ${row[0].namadosen}`);
        console.log('====================================================');
      } else {
        console.log(`mahasiswa dengan nim ${nip} tidak terdaftar`);
        console.log('====================================================');
      }
      dosenField();
    });
  });
};

const tambahDosen = () => {
  console.log('====================================================');
  console.log('lengkapi data di bawah ini:');
  const dataDosen = [];
  return rl.question('NIP: ', nip => {
    dataDosen[0] = nip;
    rl.question('nama dosen: ', namadosen => {
      dataDosen[1] = namadosen;
      const sql = `INSERT INTO dosens(nip, namadosen) VALUES(?, ?)`;

      db.run(sql, dataDosen, err => {
        if (err) throw err;

        daftarDosen();
      });
    });
  });
};

const hapusDosen = () => {
  console.log('====================================================');
  return rl.question('masukkan NIP dosen yang akan dihapus: ', answer => {
    const nip = answer;
    const sql = `DELETE FROM dosens WHERE nip = ?`;

    db.run(sql, nip, err => {
      if (err) throw err;

      daftarDosen();
    });
  });
};

const kembali = () => {
  firstQuestion();
};

const main = async () => {
  await firstQuestion();
};

main();
