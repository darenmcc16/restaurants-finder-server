const path = require('path')
const express = require('express')
const xss = require('xss')
const WishService = require('./wish-service')

const wishRouter = express.Router()
const jsonParser = express.json()

//filter out the response to avoid showing broken data
const serializeWish = wish => ({
    id: wish.id,
    restaurant: xss(wish.restaurant),
    completed: wish.completed
})

wishRouter
    .route('/')
    //relevant
    .get((req, res, next) => {

        //connect to the service to get the data
        WishService.getWishes(req.app.get('db'))
            .then(wish => {
                //map the results to get each one of the objects and serialize them
                res.json(wish.map(serializeWish))
            })
            .catch(next)
    })
    //relevant
    .post(jsonParser, (req, res, next) => {

        //take the input from the wish
        const {
            restaurant,
            completed = false
        } = req.body
        const newWish = {
            restaurant,
            completed
        }

        //validate the input
        for (const [key, value] of Object.entries(newWish)) {
            if (value == null) {
                //if there is an error show it
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        //save the input in the db
        WishService.insertWish(
                req.app.get('db'),
                newWish
            )
            .then(wish => {
                res
                //display the 201 status code
                    .status(201)
                    //redirect the request to the original url adding the wish id for editing
                    .location(path.posix.join(req.originalUrl, `/${wish.id}`))
                    //return the serialized results
                    .json(serializeWish(wish))
            })
            .catch(next)
    })


wishRouter
    .route('/:wish_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.wish_id))) {
            //if there is an error show it
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }

        //connect to the service to get the data
        wishService.getWishesById(
                req.app.get('db'),
                req.params.wish_id
            )
            .then(wish => {
                if (!wish) {
                    //if there is an error show it
                    return res.status(404).json({
                        error: {
                            message: `wish doesn't exist`
                        }
                    })
                }
                res.wish = wish
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {

        //get each one of the objects from the results and serialize them
        res.json(serializeWish(res.wish))
    })
    //relevant
    .patch(jsonParser, (req, res, next) => {

        //take the input from the wish
        const {
            restaurant,
            completed
        } = req.body
        const wishToUpdate = {
            restaurant,
            completed
        }

        //validate the input by checking the length of the wishToUpdate object to make sure that we have all the values
        const numberOfValues = Object.values(wishToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            //if there is an error show it
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'name' or 'completed'`
                }
            })
        }

        //save the input in the db
        WishService.updateWish(
                req.app.get('db'),
                req.params.wish_id,
                wishToUpdate
            )
            .then(updatedWish => {

                //get each one of the objects from the results and serialize them
                res.status(200).json(serializeWish(updatedWish))
            })
            .catch(next)
    })
    //relevant
    .delete((req, res, next) => {
        wishService.deleteWish(
                req.app.get('db'),
                req.params.wish_id
            )
            .then(numRowsAffected => {

                //check how many rows are effected to figure out if the delete was successful
                res.status(204).json(numRowsAffected).end()
            })
            .catch(next)
    })


module.exports = wishRouter