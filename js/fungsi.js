const tambahRakBuku = function(key,rakBuku) {
	// Menambahkan element rak buku ke objek global agar mudah dimanipulasi
	Object.defineProperty(Element_Rak_Buku,key,{
		value: rakBuku,
		writeable: false,
		enumerable: true
	});
	// Menampilkan element rak buku
	document.getElementById(ID_RAK_BUKU).append(rakBuku);
}
function tampilData(data) {
	// Membuat element rak buku
	const rak_buku_selesai_dibaca = new RakBukuElement(RAK_BUKU_SELESAI_DIBACA);
	const rak_buku_belum_selesai_dibaca = new RakBukuElement(RAK_BUKU_BELUM_SELESAI_DIBACA);

	// Memasukkan buku ke element rak buku
	if (data != null && Object.keys(data).length > 0) {
		for (buku of Object.values(data)) {
			if (buku.isComplete) {
				rak_buku_selesai_dibaca.tambahBuku(new BukuElement(buku));
			} else {
				rak_buku_belum_selesai_dibaca.tambahBuku(new BukuElement(buku));
			}	
		}
	}
	tambahRakBuku(RAK_BUKU_BELUM_SELESAI_DIBACA,rak_buku_belum_selesai_dibaca);
	tambahRakBuku(RAK_BUKU_SELESAI_DIBACA,rak_buku_selesai_dibaca);
}
function tambahBuku(form) {
	const objBuku = ObjBuku(
		form['judul'].value,
		form['penulis'].value,
		Number(form['tahun'].value),
		form['selesai-dibaca'].checked
	);
	const buku = new BukuElement(objBuku);
	if (objBuku.isComplete) {
		Element_Rak_Buku[RAK_BUKU_SELESAI_DIBACA].tambahBuku(buku);
		RAK_BUKU[objBuku.id] = objBuku;
	} else {
		Element_Rak_Buku[RAK_BUKU_BELUM_SELESAI_DIBACA].tambahBuku(buku);
		RAK_BUKU[objBuku.id] = objBuku;
	}
	const event = new CustomEvent(EVENT_KEY_ONDATA_ADDED,{'detail':{'data':objBuku}});
	document.dispatchEvent(event);
	// update ke localstorage
	simpanData();
}

/* 
 * QUERY PENCARIAN BUKU
 */
function cariBuku(key) {
	const hasil = [];
	for (const objBuku of Object.values(RAK_BUKU)){
		// kunci pencarian dipisah setiap kata
		const keys = key.replace(/\s+/g, ' ').trim().split(' ');
		// Membuat regular expression string nya
		// Setiap kata dicari dengan logika AND
		let regexStr = "^(?=.*";
		regexStr += keys.join(')(?=.*');
		regexStr += ").*$";
		const regexAnd = new RegExp(regexStr,'gi'); // global,ignoreCase
		// cek regex apakah cocok
		if (objBuku.title.match(regexAnd)) {
			// Membuat objek baru agar tidak menimpa objek yang lama
			const objBaru = Object.create(objBuku);
			// REGEX berbeda dengan kunci yg sama tapi menggunakan logika OR
			const regexOr = new RegExp(keys.join('|'),'gi');
			// Membuat judul buku yang ditandai dengan tag <mark>
			objBaru['title html'] = objBaru.title.replace(regexOr,function(match){
				return `<mark>${match}</mark>`;
			});
			hasil.push(objBaru);
		}
	}
	// Menampilkan buku di rak buku
	// yang sama dengan hasil pencarian
	Element_Rak_Buku[RAK_BUKU_BELUM_SELESAI_DIBACA].tampilBuku(hasil);
	Element_Rak_Buku[RAK_BUKU_SELESAI_DIBACA].tampilBuku(hasil);
}