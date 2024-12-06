'use client'
import React, {useState, useEffect} from 'react'
import style from './payment.module.css'

const PaymentPage = () => {
    return (
        <div className={style.payment}>
            <div className={style.payment__container}>
                <h1>Payment</h1>
                <div className={style.payment__section}>
                    <div className={style.payment__title}>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className={style.payment__address}>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>
                <div className={style.payment__section}>
                    <div className={style.payment__title}>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className={style.payment__items}>
                        <div className={style.payment__item}>
                            <div className={style.payment__itemInfo}>
                                <p>Product 1</p>
                                <p className={style.payment__itemInfoTop}>
                                    <small>$</small>
                                    <strong>19.99</strong>
                                </p>
                            </div>
                        </div>
                        <div className={style.payment__item}>
                            <div className={style.payment__itemInfo}>
                                <p>Product 2</p>
                                <p className={style.payment__itemInfoTop}>
                                    <small>$</small>
                                    <strong>29.99</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.payment__section}>
                    <div className={style.payment__title}>
                        <h3>Payment Method</h3>
                    </div>
                    <div className={style.payment__details}>
                        {/* Stripe magic will go */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage