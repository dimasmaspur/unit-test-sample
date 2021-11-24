import RawMaterialRepository, { IRawMaterial } from '../repositories/modules/rawMaterial';

class rawMaterialService {
    constructor() {}

    updateFlagRawMaterial = async (id: string) => {
        const rawMaterial = await RawMaterialRepository.findOne({ id: id });
        let qty = 0;
        if (rawMaterial.rawMaterialHistories.length != 0) qty = rawMaterial.rawMaterialHistories.map((items: any) => parseInt(items.qtyAccepted) - parseInt(items.used));

        let minStock = rawMaterial.minStock;
        let rawMaterialData = <IRawMaterial>{};
        rawMaterialData.id = rawMaterial.id;

        if (qty < minStock) {
            rawMaterialData.isLessThanStock = true;
        } else {
            rawMaterialData.isLessThanStock = false;
        }
        await RawMaterialRepository.update(rawMaterialData);
    };
}

export default new rawMaterialService();
