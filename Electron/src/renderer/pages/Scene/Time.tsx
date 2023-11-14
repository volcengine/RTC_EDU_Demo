import React from 'react';
import { useEffect, useState } from 'react';
import styles from './index.module.less';

const WeekMap: Record<number, string> = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  0: '日',
};

function getTime() {
  const curDate = new Date();
  const day = curDate.toLocaleDateString().replaceAll('/', '.');

  const week = WeekMap[curDate.getDay()];

  const time = curDate.toLocaleTimeString().split(':');
  time.length = 2;

  return {
    date: `${day} 星期${week}`,
    time: time.join(':'),
  };
}

function Time() {
  const [date, setDate] = useState(getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(getTime());
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [date]);

  return (
    <div className={styles.timeWrapper}>
      <span className={styles.time}>{date.time}</span>
      <span className={styles.date}>{date.date}</span>
    </div>
  );
}

export default Time;
