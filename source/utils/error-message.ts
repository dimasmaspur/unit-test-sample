class ErrorMessage {
    public static errorMessage: ErrorMessage = new ErrorMessage();

    fieldsRequired(fields: Array<string>): string {
        return `${fields} - wajib diisi`;
    }

    failDeleted(subject: string): string {
        return `${subject} gagal di hapus`;
    }

    failDeletedParent(subject: string, subject2: string): string {
        return `Anda tidak dapat mengahapus ${subject} !, ${subject} mempunyai ${subject2} di dalamnya, hapus seluruh ${subject2} untuk melanjutkan`;
    }

    failDeletedParentObject(subject: string, subject2: string): object {
        return {
            title: `Anda tidak dapat menghapus ${subject}!`,
            message: `${subject} mempunyai ${subject2} di dalamnya, hapus seluruh ${subject2} untuk melanjutkan`
        };
    }

    alreadyExist(subject: string): string {
        return `${subject} sudah terpakai`;
    }

    maxUsed(subject: string, stock: string): string {
        return `${subject} melebihi stok yang ada yaitu : ${stock}`;
    }

    notFound(subject: string): string {
        return `${subject} tidak ditemukan`;
    }
    found(subject: string, subject2: string): string {
        return `${subject} mempunyai ${subject2} di dalamnya,`;
    }

    wrongPassword(subject: string): string {
        return `${subject} salah`;
    }
    greaterThan(subject: string): string {
        return `${subject} melebihi jumlah baris blok`;
    }

    area(subject: any): string {
        return `Luas Blok melebihi jumlah area divisi, sisa : ${subject}`;
    }

    lowerThan(subject: string): string {
        return `${subject} kurang`;
    }

    general(subject: string): string {
        return `${subject}`;
    }
    alreadyTaksasi(subject: string): string {
        return `Tidak bisa dihapus karena ada ${subject}`;
    }
}

export default new ErrorMessage();
