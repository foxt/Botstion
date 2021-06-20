module.exports = (db) => async(user) => {
    let userID = user.toString();
    if (user.id) {
        userID = user.id;
    }
    let wallet = await db.tables.wallet.findOne({ where: { userId: userID } });
    if (wallet) {
        return wallet.get("coins");
    } else {
        await db.tables.wallet.create({
            userId: userID,
            coins: 0
        });
        return 0;
    }
};