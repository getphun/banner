# banner

Adalah modul yang menyediakan data banner/ads untuk frontpage. Modul ini menyediakan
service dengan nama `banner` yang bisa diakses dari view dengan perintah `$this->banner->{method}`.

Sampai saat ini, modul banner bisa menangani ads dengan type standar banner, script,
google ads, dan facebook audience network.

Tidak ada konfigurasi tambahan pada level aplikasi, tapi modul ini membutuhkan jQuery
terinstall pada level frontpage agar bisa berjalan dengan baik. Jika menggunakan
Facebook Audience Network, maka facebook JS API dengan ads juga harus terinstal.

Silahkan mengacu pada wiki untuk cara instalasi dan penggunaannya.