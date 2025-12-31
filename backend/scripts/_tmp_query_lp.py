import pymysql, json
conn = pymysql.connect(host='127.0.0.1', user='root', password='', db='cms')
cur = conn.cursor()
cur.execute('SELECT id, student_id, lecture_id, is_completed FROM lecture_progress')
rows = cur.fetchall()
print('LP rows:', len(rows))
for r in rows:
    print(r)
cur.close()
conn.close()
