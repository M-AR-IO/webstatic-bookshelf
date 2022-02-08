let RAK_BUKU = {};
const ID_RAK_BUKU = 'rak-buku';
const Element_Rak_Buku = {};

const RAK_BUKU_SELESAI_DIBACA = 'SELESAI DIBACA';
const RAK_BUKU_BELUM_SELESAI_DIBACA = 'BELUM SELESAI DIBACA';

const STORAGE_KEY = "list buku";

const EVENT_KEY_ONDATA_LOADED = "onlistloaded";
const EVENT_KEY_ONDATA_DELETED = "ondatadeleted";
const EVENT_KEY_ONDATA_SAVED = "ondatasaved";
const EVENT_KEY_ONDATA_CHANGED = "ondatachanged";
const EVENT_KEY_ONDATA_ADDED = "ondataadded";

const ObjBuku = function(judul,penulis,tahun,sudah_dibaca = false) {
	return {
		id: new Date().getTime(),
		title: judul,
		author: penulis,
		year: tahun,
		isComplete: sudah_dibaca
	};
}

function loadData() {
	const serializedData = localStorage.getItem(STORAGE_KEY);

	let data = JSON.parse(serializedData);

	if (data) RAK_BUKU = data;

	const event = new CustomEvent(EVENT_KEY_ONDATA_LOADED,{"detail":{"data":RAK_BUKU}});
	document.dispatchEvent(event);
}
const hapusBuku = function(buku) {
	delete RAK_BUKU[buku.id];
	delete RAK_BUKU[buku.id];
	const event = new CustomEvent(EVENT_KEY_ONDATA_DELETED,{'detail':{'data':buku}});
	document.dispatchEvent(event);
	simpanData();
}
const simpanData = function() {
	const parsed = JSON.stringify(RAK_BUKU);
	localStorage.setItem(STORAGE_KEY,parsed);
	const event = new CustomEvent(EVENT_KEY_ONDATA_SAVED,{'detail':{'data':RAK_BUKU}});
	document.dispatchEvent(event);
}
function isStorageExist() {
	if (typeof(Storage) === undefined) {
		alert("Browser tidak mendukung localStorage maupun sessionStorage!");
		return false;
	}
	return true;
}

// add word auto breaker into html element
function getTextWithAutoBreaker(text,maxLength = 5) {
	const words = text.split(' ');
	for (let j = 0; j < words.length; j++) {
		let word = words[j];
		if (word.length > maxLength) {
			let result = "";
			for (let i = 0; i < word.length; i++) {
				result += word[i];
				if (i % maxLength == maxLength - 1) {
					result += "&shy;";
				}
			}
			words[j] = result;
		}
	}
	return words.join(' ');
}
function insertInnerTextWithAutoBreaker(element,text,maxLength = 5) {
	element.innerHTML = getTextWithAutoBreaker(text,maxLength);
}

// class HTMLElement custom dialog
class CustomDialog extends HTMLElement {
	#headerIconEl
	#closeBtn
	#titleEl
	#pesanEl
	#cancelBtn
	#yesBtn
	constructor() {
		super();

		const dialog = this;
		// Element root
		this.classList.add('dialog-overlay');
		// Element dialog (card)
		const dialogEl = document.createElement('div');
		dialogEl.classList.add('card','dialog');
		// inner card
		const innerCard = document.createElement('div');
		innerCard.classList.add('card-inner');
		// card header
		const cardHeader = document.createElement('div');
		cardHeader.classList.add('card-header');
		// header icon
		this.#headerIconEl = document.createElement('div');
		this.#headerIconEl.classList.add('gambar','peringatan');
		this.setHeaderIcon(this.getAttribute('iconheadersrc'));
		// header title
		this.#titleEl = document.createElement('div');
		this.#titleEl.classList.add('card-judul');
		this.setTitle(this.getAttribute('headertitle'));
		// btn close
		this.#closeBtn = document.createElement('button');
		this.#closeBtn.classList.add('icon-only','btn-close');
		this.#closeBtn.addEventListener('click',function(){
			dialog.cancel();
		});
		// gabung header
		cardHeader.append(this.#headerIconEl,this.#titleEl,this.#closeBtn);
		// konten
		this.#pesanEl = document.createElement('div');
		this.#pesanEl.classList.add('card-konten');
		this.setMessage(this.getAttribute('pesan'));
		// card footer
		const cardFooter = document.createElement('div');
		cardFooter.classList.add('card-footer');
		// btn cancle
		this.#cancelBtn = document.createElement('button');
		this.#cancelBtn.classList.add('color-reverse');
		this.setCancelBtn(this.getAttribute('cancelbtntext'));
		this.#cancelBtn.addEventListener('click',function(){
			dialog.cancel();
		});
		// btn yes
		this.#yesBtn = document.createElement('button');
		this.#yesBtn.classList.add('warning');
		this.setYesBtn(this.getAttribute('yesbtntext'),this.getAttribute('onclickbtnyes'));
		// gabung card footer
		cardFooter.append(this.#cancelBtn,this.#yesBtn);
		// gabung card
		innerCard.append(cardHeader,this.#pesanEl,cardFooter);
		// gabung root card
		dialogEl.append(innerCard);
		// gabung root el
		this.append(dialogEl);
	}
	connectedCallback() {
		document.body.classList.add('dialog-open');
	}
	disconnectedCallback() {
		document.body.classList.remove('dialog-open');
	}
	static get observedAttributes() {
		return [
			'iconheadersrc',
			'headertitle',
			'pesan',
			'cancelbtntext',
			'yesbtntext',
			'onclickbtnyes'
		]
	}
	attributeChangedCallback(name, oldValue, newValue) {
		switch(name){
			case 'iconheadersrc':
				this.setHeaderIcon(newValue);
				break;
			case 'headertitle':
				this.setTitle(newValue);
				break;
			case 'pesan':
				this.setMessage(newValue);
				break;
			case 'cancelbtntext':
				this.setCancelBtn(newValue);
				break;
			case 'yesbtntext':
				this.#yesBtn.innerHTML = newValue;
				break;
			case 'onclickbtnyes':
				this.#yesBtn.addEventListener('click',newValue);
				break;
		}
	}

	setHeaderIcon(iconURL) {
		if (iconURL) {
			this.#headerIconEl.style.backgroundImage = `url(${iconURL})`;
		}
	}
	setTitle(title = 'Warning!!!') {
		this.#titleEl.innerHTML = title;
	}
	setMessage(pesan = 'Ini pesan berbahaya!!!') {
		this.#pesanEl.innerHTML = pesan;
	}
	setCancelBtn(teks = 'Batal') {
		this.#cancelBtn.innerHTML = teks;
	}
	setYesBtn(teks = 'Lanjutkan',oncliked) {
		const dialog = this;
		this.#yesBtn.addEventListener('click',function(){
			if(typeof(oncliked) == 'function') oncliked();
			dialog.cancel();
		});
		this.#yesBtn.innerHTML = teks;
	}

	cancel() {
		this.remove();
	}
	show() {
		document.body.append(this);
	}
}
customElements.define('custom-dialog',CustomDialog);

// class HTMLElement buku
class BukuElement extends HTMLElement {
	#judul
	#btnHapus
	#penulis
	#tahun
	#btnBaca
	constructor(buku = ObjBuku("","",0,false)) {
		super();

		this.object = buku;

		const bukuElement = this;
		// Menambahkan class di element root
		this.classList.add('card','buku');
		// Membuat element inner card atau element didalam root
		const innerCard = document.createElement('div');
		innerCard.classList.add('card-inner');
		// Membuat element header
		const headerCard = document.createElement('div');
		headerCard.classList.add('card-header');
		// Membuat element judul didalam header
		this.#judul = document.createElement('div');
		this.#judul.classList.add('card-judul');
		this.setTitle();
		// Membuat element tombol hapus buku
		this.#btnHapus = document.createElement('button');
		this.#btnHapus.classList.add('icon-only','btn-sampah');
		// Menambah event click (hapus buku)
		this.#btnHapus.addEventListener('click',function(){
			bukuElement.delete();
		});
		// Gabungkan header
		headerCard.append(this.#judul,this.#btnHapus);
		// Membuat element container detail buku
		const konten = document.createElement('div');
		konten.classList.add('card-konten');
		// Membuat element didalamnnya
		const subKonten = document.createElement('div');
		subKonten.classList.add('list-item');
		// Membuat item didalamnya
		// item penulis
		this.#penulis = document.createElement('div');
		this.#penulis.classList.add('item');
		this.setAuthor();
		// item tahun
		this.#tahun = document.createElement('div');
		this.#tahun.classList.add('item');
		this.setYear();
		// Menggabungkan detail buku
		konten.append(subKonten);
		subKonten.append(this.#penulis,this.#tahun);
		// Membuat footer
		const footer = document.createElement('div');
		footer.classList.add('card-footer');
		// Membuat tombol selesai baca atau belum selesai
		this.#btnBaca = document.createElement('button');
		this.#btnBaca.addEventListener('click',function(){
			bukuElement.tandaiBuku();
		});
		this.setButton();
		// Menggabungkan footer
		footer.append(this.#btnBaca);
		// Menggabungkan semuanya
		innerCard.append(headerCard,konten,footer);
		this.append(innerCard);

		this.rakElement = null;
	}
	// only UI effected
	static get observedAttributes() {
		return [
			'title',
			'author',
			'year',
			'iscomplete'
		]
	}
	attributeChangedCallback(name, oldValue, newValue) {
		switch(name){
			case 'title':
				this.setTitle(newValue);
				break;
			case 'author':
				this.setAuthor(newValue);
				break;
			case 'year':
				this.setYear(newValue);
				break;
			case 'iscomplete':
				this.setButton(newValue);
				break;
		}
	}
	setTitle(title) {
		title = title || this.getAttribute('title') || this.object.title || "[unknown]";
		insertInnerTextWithAutoBreaker(this.#judul,title);
	}
	setHTMLTitle(htmlTitle) {
		htmlTitle = htmlTitle || this.getAttribute('htmltitle') || this.object.title || "[unknown]";
		this.#judul.innerHTML = htmlTitle;
	}
	setAuthor(author) {
		author = author || this.getAttribute('author') || this.object.author || "[unknown]";
		const penulisHTML = `
			<div class='nama-item'>Penulis</div>
			<div class='isi-item'>${author}</div>
			`;
		this.#penulis.innerHTML = penulisHTML;
	}
	setYear(year) {
		year = year || this.getAttribute('year') || this.object.year || "[unknown]";
		const tahunHTML = `
			<div class='nama-item'>Tahun</div>
			<div class='isi-item'>${year}</div>
			`;
		this.#tahun.innerHTML = tahunHTML;
	}
	setButton(isComplete) {
		isComplete = isComplete || this.getAttribute('iscomplete') || this.object.isComplete;
		if (isComplete && isComplete !== "false") {
			this.#btnBaca.classList.add('color-reverse');
			this.#btnBaca.innerText = "Belum Selesai Dibaca";
		} else {
			this.#btnBaca.classList.remove('color-reverse');
			this.#btnBaca.innerText = "Selesai Dibaca";
		}
	}

	// Data manipulation
	delete() {
		const bukuElement = this;
		// buat dialog
		const dialog = new CustomDialog();
		dialog.setTitle("Peringatan!!!");
		dialog.setMessage(`<p>Hapus buku "<b>${getTextWithAutoBreaker(this.object.title)}</b>"?</p>`);
		dialog.setCancelBtn("Batal");
		dialog.setYesBtn("Hapus",function(){
			// Hapus element dari rak
			bukuElement.rakElement.hapusBuku(bukuElement);
			/* Hapus dari variabel global yang nantinya 
			 * akan digunakan untuk menyimpan di localStorage
			 */
			hapusBuku(bukuElement.object);
		});
		// tampilkan dialog
		dialog.show();
	}
	tandaiBuku(isComplete) {
		if (isComplete === undefined) {
			isComplete = !this.object.isComplete;
		}
		/* data manipulating (karena berbentuk objek maka 
		 * objek yang sama di variabel global juga akan berefek 
		 * dengan perubahan dibawah)
		 */
		this.object.isComplete = isComplete;
		// UI manipulating
		this.rakElement.hapusBuku(this);
		this.setButton(isComplete);
		if (isComplete) {
			Element_Rak_Buku[RAK_BUKU_SELESAI_DIBACA].tambahBuku(this);
		} else {
			Element_Rak_Buku[RAK_BUKU_BELUM_SELESAI_DIBACA].tambahBuku(this);
		}
		// simpan perubahan data buku
		const event = new CustomEvent(EVENT_KEY_ONDATA_CHANGED,{'detail':{'data':this.object}});
		document.dispatchEvent(event);
		simpanData();
	}
}
customElements.define('buku-element',BukuElement);

// class rak buku element
class RakBukuElement extends HTMLElement {
	#header
	#konten
	#teksLabelKosong
	constructor(nama_rak) {
		super();

		this.classList.add('subcard','rak-buku');
		// Membuat element header
		this.#header = document.createElement('div');
		this.#header.classList.add('card-header', 'flex-center');
		this.setTitle(nama_rak);
		// Membuat element card-konten atau element container buku
		this.#konten = document.createElement('div');
		this.#konten.classList.add('card-konten');
		// Membuat object untuk list buku yang kosong
		this.books = {};
		// Membuat element yang akan ditampilkan jika buku kosong	
		this.#teksLabelKosong = document.createElement('div');
		this.#teksLabelKosong.classList.add('error-tidak-ada-buku','text-glow');
		this.#teksLabelKosong.innerText = "Buku tidak ditemukan!";
		// Masukkan element yang sudah dibuat
		this.append(this.#header,this.#konten);

		this.refresh();
	}
	// UI manipulation
	static get observedAttributes() {
		return [
			'title'
		]
	}
	attributeChangedCallback(name, oldValue, newValue) {
		switch(name){
			case 'title':
				this.setTitle(newValue);
				break;
		}
	}
	setTitle(title) {
		title = title || this.getAttribute('title') || "[unknown]";
		this.#header.innerText = title;
	}
	tambahBuku() {
		for (const arg of arguments){
			if (arg instanceof BukuElement) {
				this.books[arg.object.id] = arg;
				this.#konten.append(arg);
				arg.rakElement = this;
			}
		}
		this.refresh();
	}
	hapusBuku() {
		for (const arg of arguments){
			if (arg instanceof BukuElement) {
				// Hapus element buku dari rak
				delete this.books[arg.object.id];
				arg.remove();
				arg.rakElement = null;
			}
		}
		this.refresh();
	}
	refresh() {
		if (!Object.keys(this.books).length) { // Jika buku kosong
			// Hapus semua element didalam kontenEl
			this.#konten.innerHTML = '';
			// Tampilkan teks kosong
			this.#konten.append(this.#teksLabelKosong);
		} else {
			this.#teksLabelKosong.remove();
		}
	}
	tampilSemuaBuku() {
		this.#konten.innerHTML = '';
		for (const buku of Object.values(this.books)) {
			this.#konten.append(buku);
		}
		this.refresh();
	}
	tampilBuku(arrBuku) {
		this.#konten.innerHTML = '';
		for (const buku of arrBuku) {
			const bukuEl = this.books[buku.id];
			if (bukuEl) {
				bukuEl.setHTMLTitle(buku['title html']);
				this.#konten.append(bukuEl);
			}
		}
		if (this.#konten.childElementCount > 0) {
			this.#teksLabelKosong.remove();
		} else {
			this.#konten.append(this.#teksLabelKosong);
		}
	}
}
customElements.define('rak-buku',RakBukuElement);