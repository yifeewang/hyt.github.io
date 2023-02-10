import { Button, Form, Input, Popconfirm, Table, InputNumber, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './App.css'
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const App = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: 0,
      index: 1,
      name: '张三',
      chinese: '59',
      math: '78',
      english: '99',
      daofa: '88',
    },
    {
      key: 1,
      index: 2,
      name: '李四',
      chinese: '68',
      math: '98',
      english: '50',
      daofa: '88',
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();
  const [count, setCount] = useState(2);
  const [userName, setUserName] = useState('');
  const [studentNumShould, seStudentNumShould] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //应考人数：	
  const [studentNumReal, seStudentNumReal] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //实考人数：	
  const [allPoint, setAllPoint] = useState({chinese: 100, math: 100, english: 100, daofa: 100}); //总分：	
  const [averagePoint, setAveragePoint] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //平均分：	
  const [sixtyNum, setSixtyNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //及格人数：	
  const [sixtyPr, setSixtyPr] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //及格率：	
  const [prettyNum, setPrettyNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //优分人数：	
  const [prettyPr, setPrettyPr] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //优分率：	
  const [badNum, setBadNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //低分人数：	
  const [badPr, setBadPr] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //低分率：	
  const [maxAndNum, setMaxAndNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //最高分及人次：	
  const [minAndNum, setMinAndNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //最低分及人次：	
  const [onehundredNum, setOnehundredNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //100分人次：	
  const [ninetyNum, setNinetyNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //99.5-90分人次：	
  const [eieghtyNum, setEieghtyNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //89.5-80分人次：	
  const [seventyNum, setSeventyNum] = useState({chinese: 0, math: 0, english: 0, daofa: 0}); //79.5-70分人次：	
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: '学号',
      dataIndex: 'index',
      width: '10%',
      editable: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: '语文',
      dataIndex: 'chinese',
      editable: true,
    },
    {
      title: '数学',
      dataIndex: 'math',
      editable: true,
    },
    {
      title: '英语',
      dataIndex: 'english',
      editable: true,
    },
    {
      title: '道法',
      dataIndex: 'daofa',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      index: count + 1,
      name: 'Edward King ' + count,
      chinese: Math.floor(Math.random()*100),
      math: Math.floor(Math.random()*100),
      english: Math.floor(Math.random()*100),
      daofa: Math.floor(Math.random()*100),
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const onChangeShould = (type) => {
    switch (type) {
        case 'chinese':
            
            break;
    
        default:
            break;
    }
  }
  const onChangeUserName = (e) => {
    const name = e.target.value;
    setUserName(name)
    if(name === '黄艳婷') {
        messageApi.open({
            type: 'success',
            content: '尊贵的超级vip用户，欢迎使用！',
        });
    } else {
        messageApi.open({
          type: 'error',
          content: '答案不对哦！',
        });
    }
  }
  useEffect(() => {
    let chineseMap = new Map();
    let mathMap = new Map();
    let englishMap = new Map();
    let daofaMap = new Map();
    let chinesePoint = 0, mathPoint = 0, englishPoint = 0, daofaPoint = 0;
    let sixtyChineseNum = 0, sixtyMathNum = 0, sixtyEnglishNum = 0, sixtyDaofaNum = 0;
    let prettyChineseNum = 0, prettyMathNum = 0, prettyEnglishNum = 0, prettyDaofaNum = 0;
    let badChineseNum = 0, badMathNum = 0,badEnglishNum = 0, badDaofaNum = 0;
    let oneChineseNum = 0, oneMathNum = 0,oneEnglishNum = 0, oneDaofaNum = 0;
    let nineChineseNum = 0, nineMathNum = 0,nineEnglishNum = 0, nineDaofaNum = 0;
    let eightChineseNum = 0, eightMathNum = 0,eightEnglishNum = 0, eightDaofaNum = 0;
    let sevenChineseNum = 0, sevenMathNum = 0,sevenEnglishNum = 0, sevenDaofaNum = 0;
    // let max = '0/0', min = '0/0';
    let studentNum = dataSource.length;
    dataSource.forEach(item => {
        item.chinese = item.chinese*1
        item.math = item.math*1
        item.english = item.english*1
        item.daofa = item.daofa*1
        // 平均分：	
        chinesePoint += item.chinese;
        mathPoint += item.math;
        englishPoint += item.english;
        daofaPoint += item.daofa;
        //及格人数：	
        if(item.chinese >= 60) {
            sixtyChineseNum++
        }
        if(item.math >= 60) {
            sixtyMathNum++
        }
        if(item.english >= 60) {
            sixtyEnglishNum++
        }
        if(item.daofa >= 60) {
            sixtyDaofaNum++
        }
        //优分人数：	
        if(item.chinese >= 80) {
            prettyChineseNum++
        }
        if(item.math >= 80) {
            prettyMathNum++
        }
        if(item.english >= 80) {
            prettyEnglishNum++
        }
        if(item.daofa >= 80) {
            prettyDaofaNum++
        }	
        //100分人次：		
        if(item.chinese == 100) {
            oneChineseNum++
        }
        if(item.math == 100) {
            oneMathNum++
        }
        if(item.english == 100) {
            oneEnglishNum++
        }
        if(item.daofa == 100) {
            oneDaofaNum++
        }
        //90分人次：		
        if(item.chinese <= 99.5 && item.chinese >= 90) {
            nineChineseNum++
        }
        if(item.math <= 99.5 && item.math >= 90) {
            nineMathNum++
        }
        if(item.english <= 99.5 && item.english >= 90) {
            nineEnglishNum++
        }
        if(item.daofa <= 99.5 && item.daofa >= 90) {
            nineDaofaNum++
        }
        //80分人次：			
        if(item.chinese <= 89.5 && item.chinese >= 80) {
            eightChineseNum++
        }
        if(item.math <= 89.5 && item.math >= 80) {
            eightMathNum++
        }
        if(item.english <= 89.5 && item.english >= 80) {
            eightEnglishNum++
        }
        if(item.daofa <= 89.5 && item.daofa >= 80) {
            eightDaofaNum++
        }
        //70分人次：		
        if(item.chinese <= 79.5 && item.chinese >= 70) {
            sevenChineseNum++
        }
        if(item.math <= 79.5 && item.math >= 70) {
            sevenMathNum++
        }
        if(item.english <= 79.5 && item.english >= 70) {
            sevenEnglishNum++
        }
        if(item.daofa <= 79.5 && item.daofa >= 70) {
            sevenDaofaNum++
        }
        //最高分及人次：	
        //最低分及人次：	
        if(chineseMap.has(item.chinese)) {
            chineseMap.set(item.chinese, chineseMap.get(item.chinese) + 1)
        } else {
            chineseMap.set(item.chinese, 1)
        }
        if(mathMap.has(item.math)) {
            mathMap.set(item.math, mathMap.get(item.math) + 1)
        } else {
            mathMap.set(item.math, 1)
        }
        if(englishMap.has(item.english)) {
            englishMap.set(item.english, englishMap.get(item.english) + 1)
        } else {
            englishMap.set(item.english, 1)
        }
        if(daofaMap.has(item.daofa)) {
            daofaMap.set(item.daofa, daofaMap.get(item.daofa) + 1)
        } else {
            daofaMap.set(item.daofa, 1)
        }
    })
    //最高/低分及人次
    let chineseArr = [], mathArr = [], englishArr = [], daofaArr = [];
    let chineseMax = 0, mathMax = 0, englishMax = 0, daofaMax = 0;
    let chineseMin = 0, mathMin = 0, englishMin = 0, daofaMin = 0;
    for(let [key, val] of chineseMap) {
        chineseArr.push(key)
    }
    for(let [key, val] of mathMap) {
        mathArr.push(key)
    }
    for(let [key, val] of englishMap) {
        englishArr.push(key)
    }
    for(let [key, val] of daofaMap) {
        daofaArr.push(key)
    }
    chineseMax = Math.max(...chineseArr);
    mathMax = Math.max(...mathArr);
    englishMax = Math.max(...englishArr);
    daofaMax = Math.max(...daofaArr);
    chineseMin = Math.min(...chineseArr);
    mathMin = Math.min(...mathArr);
    englishMin = Math.min(...englishArr);
    daofaMin = Math.min(...daofaArr);
    //低分人数：
    dataSource.forEach(item => {
        if(item.chinese*1 <= chinesePoint/studentNum/2) {
            badChineseNum++
        }
        if(item.math*1 <= mathPoint/studentNum/2) {
            badMathNum++
        }
        if(item.english*1 <= englishPoint/studentNum/2) {
            badEnglishNum++
        }
        if(item.daofa*1 <= daofaPoint/studentNum/2) {
            badDaofaNum++
        }
    })

    setAveragePoint({
        chinese: (chinesePoint/studentNum).toFixed(2), 
        math: (mathPoint/studentNum).toFixed(2), 
        english: (englishPoint/studentNum).toFixed(2), 
        daofa: (daofaPoint/studentNum).toFixed(2)
    })
    setSixtyNum({
        chinese: sixtyChineseNum.toFixed(2), 
        math:sixtyMathNum.toFixed(2), 
        english: sixtyEnglishNum.toFixed(2), 
        daofa: sixtyDaofaNum.toFixed(2),
    })
    setSixtyPr({
        chinese: (sixtyChineseNum/studentNum* 100).toFixed(2) + '%', 
        math: (sixtyMathNum/studentNum* 100).toFixed(2) + '%', 
        english: (sixtyEnglishNum/studentNum* 100).toFixed(2) + '%', 
        daofa: (sixtyDaofaNum/studentNum* 100).toFixed(2) + '%',
    })
    setPrettyNum({
        chinese: prettyChineseNum.toFixed(2), 
        math: prettyMathNum.toFixed(2), 
        english: prettyEnglishNum.toFixed(2), 
        daofa: prettyDaofaNum.toFixed(2),
    })
    setPrettyPr({
        chinese: (prettyChineseNum/studentNum* 100).toFixed(2) + '%', 
        math: (prettyMathNum/studentNum* 100).toFixed(2) + '%', 
        english: (prettyEnglishNum/studentNum* 100).toFixed(2) + '%', 
        daofa: (prettyDaofaNum/studentNum* 100).toFixed(2) + '%',
    })
    setBadNum({
        chinese: badChineseNum.toFixed(2), 
        math: badMathNum.toFixed(2), 
        english: badEnglishNum.toFixed(2), 
        daofa: badDaofaNum.toFixed(2)
    })
    setBadPr({
        chinese: (badChineseNum/studentNum* 100).toFixed(2) + '%', 
        math: (badMathNum/studentNum* 100).toFixed(2) + '%', 
        english: (badEnglishNum/studentNum* 100).toFixed(2) + '%', 
        daofa: (badDaofaNum/studentNum* 100).toFixed(2) + '%',
    })
    setMaxAndNum({
        chinese: chineseMax + '/' + chineseMap.get(chineseMax), 
        math: mathMax + '/' + mathMap.get(mathMax), 
        english: englishMax + '/' + englishMap.get(englishMax), 
        daofa: daofaMax + '/' + daofaMap.get(daofaMax)
    })
    setMinAndNum({
        chinese: chineseMin + '/' + chineseMap.get(chineseMin), 
        math: mathMin + '/' + mathMap.get(mathMin), 
        english: englishMin + '/' + englishMap.get(englishMin), 
        daofa: daofaMin + '/' + daofaMap.get(daofaMin)
    })
    setOnehundredNum({
        chinese: oneChineseNum.toFixed(2), 
        math: oneEnglishNum.toFixed(2), 
        english: oneEnglishNum.toFixed(2), 
        daofa: oneDaofaNum.toFixed(2)
    })
    setNinetyNum({
        chinese: nineChineseNum.toFixed(2), 
        math: nineMathNum.toFixed(2), 
        english: nineEnglishNum.toFixed(2), 
        daofa: nineDaofaNum.toFixed(2)
    })
    setEieghtyNum({
        chinese: eightChineseNum.toFixed(2), 
        math: eightMathNum.toFixed(2), 
        english: eightEnglishNum.toFixed(2), 
        daofa: eightDaofaNum.toFixed(2)
    })
    setSeventyNum({
        chinese: sevenChineseNum.toFixed(2), 
        math: sevenMathNum.toFixed(2), 
        english: sevenEnglishNum.toFixed(2), 
        daofa: sevenDaofaNum.toFixed(2)
    })
  }, [dataSource])
  return (
    <div className='wraper'>
        {contextHolder}
        <div style={{ width: '100%', textAlign: 'center', fontSize: '40px', marginBottom: '20px'}}>黄老师专用成绩统计系统</div>
        {
            userName === '黄艳婷'
            ? 
            <div className='table_wraper'>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 600 }} 
                    pagination={{showQuickJumper: true, showTotal: (total, range) => { return `共${total}个学生`}}}
                />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        onClick={handleAdd}
                        type="primary"
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        添加
                    </Button>
                </div>
            </div>
            :
            <div>
                <div style={{fontSize: '30px', marginBottom: '20px'}}>谁是世界上最可爱的人？</div>
                请回答：<Input placeholder="请输入答案" onPressEnter={onChangeUserName}  onBlur={onChangeUserName}/>
            </div>
        }
        {
            userName === '黄艳婷'
            &&
            <div className='result_wraper'>
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th>项目</th>
                            <th>语文</th>
                            <th>数学</th>
                            <th>英语</th>
                            <th>道法</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>应考人数：</td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('chinese')}} /></td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('math')}} /></td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('english')}} /></td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('daofa')}} /></td>
                        </tr>
                        <tr>
                            <td>实考人数：</td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('chinese')}} /></td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('math')}} /></td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('english')}} /></td>
                            <td><InputNumber min={0} max={1000} defaultValue={0} onChange={() => {onChangeShould('daofa')}} /></td>
                        </tr>
                        <tr>
                            <td>总分：</td>
                            <td>{allPoint.chinese}</td>
                            <td>{allPoint.math}</td>
                            <td>{allPoint.english}</td>
                            <td>{allPoint.daofa}</td>
                        </tr>
                        <tr>
                            <td>平均分：</td>
                            <td>{averagePoint.chinese}</td>
                            <td>{averagePoint.math}</td>
                            <td>{averagePoint.english}</td>
                            <td>{averagePoint.daofa}</td>
                        </tr>
                        <tr>
                            <td>及格人数：</td>
                            <td>{sixtyNum.chinese}</td>
                            <td>{sixtyNum.math}</td>
                            <td>{sixtyNum.english}</td>
                            <td>{sixtyNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>及格率：</td>
                            <td>{sixtyPr.chinese}</td>
                            <td>{sixtyPr.math}</td>
                            <td>{sixtyPr.english}</td>
                            <td>{sixtyPr.daofa}</td>
                        </tr>
                        <tr>
                            <td>优分人数：</td>
                            <td>{prettyNum.chinese}</td>
                            <td>{prettyNum.math}</td>
                            <td>{prettyNum.english}</td>
                            <td>{prettyNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>优分率：</td>
                            <td>{prettyPr.chinese}</td>
                            <td>{prettyPr.math}</td>
                            <td>{prettyPr.english}</td>
                            <td>{prettyPr.daofa}</td>
                        </tr>
                        <tr>
                            <td>低分人数：</td>
                            <td>{badNum.chinese}</td>
                            <td>{badNum.math}</td>
                            <td>{badNum.english}</td>
                            <td>{badNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>低分率：</td>
                            <td>{badPr.chinese}</td>
                            <td>{badPr.math}</td>
                            <td>{badPr.english}</td>
                            <td>{badPr.daofa}</td>
                        </tr>
                        <tr>
                            <td>最高分及人次：</td>
                            <td>{maxAndNum.chinese}</td>
                            <td>{maxAndNum.math}</td>
                            <td>{maxAndNum.english}</td>
                            <td>{maxAndNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>最低分及人次：</td>
                            <td>{minAndNum.chinese}</td>
                            <td>{minAndNum.math}</td>
                            <td>{minAndNum.english}</td>
                            <td>{minAndNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>100分人次：</td>
                            <td>{onehundredNum.chinese}</td>
                            <td>{onehundredNum.math}</td>
                            <td>{onehundredNum.english}</td>
                            <td>{onehundredNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>99.5-90分人次：</td>
                            <td>{ninetyNum.chinese}</td>
                            <td>{ninetyNum.math}</td>
                            <td>{ninetyNum.english}</td>
                            <td>{ninetyNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>89.5-80分人次：</td>
                            <td>{eieghtyNum.chinese}</td>
                            <td>{eieghtyNum.math}</td>
                            <td>{eieghtyNum.english}</td>
                            <td>{eieghtyNum.daofa}</td>
                        </tr>
                        <tr>
                            <td>79.5-70分人次：</td>
                            <td>{seventyNum.chinese}</td>
                            <td>{seventyNum.math}</td>
                            <td>{seventyNum.english}</td>
                            <td>{seventyNum.daofa}</td>
                        </tr>
                    </tbody>
                </table>
                {/* <div>应考人数：</div>
                <div>实考人数：</div>
                <div>总分：</div>
                <div>平均分：</div>
                <div>及格人数：</div>
                <div>及格率：</div>
                <div>优分人数：</div>
                <div>优分率：</div>
                <div>低分人数：</div>
                <div>低分率：</div>
                <div>最高分及人次：</div>
                <div>最低分及人次：</div>
                <div>100分人次：</div>
                <div>99.5-90分人次：</div>
                <div>89.5-80分人次：</div>
                <div>79.5-70分人次：</div> */}
            </div>
        }
    </div>
  );
};
export default App;
