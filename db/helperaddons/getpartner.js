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
            return relationshipTestOne.get("userTwoId");
        } else {
            let relationshipTestTwo = await db.tables.relationship.findOne({ where: { userTwoId: userID } });
            if(relationshipTestTwo){
                return relationshipTestTwo.get("userOneId");
            } else {
                return null;
            }
        }
    }
}