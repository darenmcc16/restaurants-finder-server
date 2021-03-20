const WishService = {
    //relevant
    getWishes(db) {
        return db
            .select('*')
            .from('wish')
    },
    getWishesById(db, wish_id) {
        return db
            .select('*')
            .from('wish')
            .where('wish.id', wish_id)
            .first()
    },
    //relevant
    insertWish(db, newWish) {
        return db
            .insert(newWish)
            .into('wish')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateWish(db, wish_id, newWish) {
        return db('usewishrs')
            .update(newWish, returning = true)
            .where({
                id: wish_id
            })
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    deleteWish(db, wish_id) {
        return db('wish')
            .delete()
            .where({
                'id': wish_id
            })
    }
}

module.exports = WishService