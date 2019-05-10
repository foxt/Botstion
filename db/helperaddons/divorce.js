module.exports = function(db) {
    return async function(user) {
        let userID = user.toString();
        if (user.id) {
            userID = user.id;
        }

        // We'll need to do two different checks to see if the relationship exists in either the first
        // column or second.
        let relationshipTestOne = await db.tables.relationship.findOne({ where: { userOneId: userID } });
        if (relationshipTestOne) {
            await db.tables.relationship.destroy({
                where: {
                    userOneId: userID
                }
            });
            return true;
        } else {
            let relationshipTestTwo = await db.tables.relationship.findOne({ where: { userTwoId: userID } });
            if(relationshipTestTwo){
                await db.tables.relationship.destroy({
                    where: {
                        userTwoId: userID
                    }
                });
                return true;
            } else {
                return false;
            }
        }
    }
}