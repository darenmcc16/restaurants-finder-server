const FavoriteService = {
    //relevant
    getFavorites(db) {
        return db
            .select('*')
            .from('favorites')
    },
    getFavoritesById(db, favorite_id) {
        return db
            .select('*')
            .from('favorites')
            .where('favorites.id', favorite_id)
            .first()
    },
    //relevant
    insertFavorite(db, newFavorite) {
        return db
            .insert(newFavorite)
            .into('favorites')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateFavorite(db, favorite_id, newFavorite) {
        return db('favorites')
            .update(newFavorite, returning = true)
            .where({
                id: favorite_id
            })
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    deleteFavorite(db, favorite_id) {
        return db('favorites')
            .delete()
            .where({
                'id': favorite_id
            })
    }
}

module.exports = FavoriteService