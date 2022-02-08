document.addEventListener('DOMContentLoaded',function(){
	const submitForm = document.getElementById('form-tambah-buku');
	const fieldCari = document.getElementById('cari-buku');
	const btnCari = document.getElementById('btn-cari');
	const temaSlider = document.getElementById('tema-slider');

	submitForm.addEventListener('submit',function(event) {
		event.preventDefault();
		tambahBuku(event.currentTarget);
	});
	submitForm['selesai-dibaca'].addEventListener('change',function(event){
		teksEl = document.getElementById('label-rak-dalam-btn');
		if (event.currentTarget.checked) {
			teksEl.innerText = RAK_BUKU_SELESAI_DIBACA;
		} else {
			teksEl.innerText = RAK_BUKU_BELUM_SELESAI_DIBACA;
		}
	});
	fieldCari.addEventListener('input',function(event) {
		const key = event.currentTarget.value;
		cariBuku(key);
	});
	btnCari.addEventListener('click',function(){
		cariBuku(fieldCari.value);
	});
	temaSlider.addEventListener('change',function(event){
		if (event.currentTarget.checked) {
			document.body.setAttribute('tema-gelap','');
		} else {
			document.body.removeAttribute('tema-gelap');
		}
	})
	window.addEventListener('load',function(){
		cariBuku(fieldCari.value);
	});

	if (isStorageExist()) {
		loadData();
	}
});
document.addEventListener(EVENT_KEY_ONDATA_LOADED,function(e){
	tampilData(e.detail.data);
});
document.addEventListener(EVENT_KEY_ONDATA_DELETED,function(e){
	console.log("Buku berhasil dihapus");
	console.table(e.detail.data);
});
document.addEventListener(EVENT_KEY_ONDATA_SAVED,function(e){
	console.log(`Total ${Object.keys(e.detail.data).length} buku berhasil disimpan`);
	console.table(e.detail.data);
});
document.addEventListener(EVENT_KEY_ONDATA_CHANGED,function(e){
	console.log("Data buku berhasil diubah");
	console.table(e.detail.data);
});
document.addEventListener(EVENT_KEY_ONDATA_ADDED,function(e){
	console.log("Buku berhasil ditambahkan");
	console.table(e.detail.data);
});