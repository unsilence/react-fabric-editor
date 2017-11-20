import React from 'react';
import styles from './panel.css'

class OperatorPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('fuck~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        return <div className={styles.box}>
            <ul>
                <li className={styles.li_a}></li>
                <li className={styles.li_b}></li>
                <li className={styles.li_c}></li>
                <li className={styles.li_d}></li>
                <li className={styles.li_e}></li>
                <li className={styles.li_f}></li>
                <li className={styles.li_j}></li>
                <li className={styles.li_l} id="leveDom">
                    <div className={styles.li_l_box} id="li_l_box">
                        <ul>
                            <li className={styles.li_l_box_a}></li>
                            <li className={styles.li_l_box_b}></li>
                            <li className={styles.li_l_box_c}></li>
                            <li className={styles.li_l_box_d}></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    }
}


export default OperatorPanel