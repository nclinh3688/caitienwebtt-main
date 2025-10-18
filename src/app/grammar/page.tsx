'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/styles/grammar.css';

interface Memo {
  id: number;
  x: number;
  y: number;
  content: string;
}

interface CompletedStatus {
  [key: string]: boolean;
}

const GrammarPage = () => {
    const grammarData = [
    {
        "id": 1,
        "category": "② Biểu thị nguyên nhân・lý do",
        "title": "～おかげで",
        "formation": "Động từ (thể thường) / Tính từ (i) + おかげで\nTính từ (na) + な / Danh từ + の + おかげで",
        "explanation_vn": "Nhờ có... (biểu thị kết quả tốt).\n",
        "explanation_jp": "～という良い結果になった原因・理由を表す。",
        "examples_jp": [
            "先生のおかげで、日本語が上手になりました。",
            "家族の応援のおかげで、試合に勝てた。",
            "早く寝たおかげで、今日は元気だ。"
        ],
        "examples_vn": [
            "Nhờ có sự giúp đỡ của bạn bè, tôi đã vượt qua kỳ thi.",
            "Nhờ trời tạnh mưa, chúng tôi đã có thể đi dạo.",
            "Nhờ có thuốc, tôi đã khỏi bệnh."
        ]
    },
    {
        "id": 2,
        "category": "② Biểu thị nguyên nhân・lý do",
        "title": "～せいで",
        "formation": "Động từ (thể thường) / Tính từ (i) + せいで\nTính từ (na) + な / Danh từ + の + せいで",
        "explanation_vn": "Do/tại vì... (biểu thị kết quả xấu).\n",
        "explanation_jp": "～という悪い結果になった原因・理由を表す。",
        "examples_jp": [
            "電車が遅れたせいで、会議に間に合わなかった。",
            "彼のせいで、プロジェクトが失敗した。",
            "携帯をいじっていたせいで、宿題が終わらなかった。"
        ],
        "examples_vn": [
            "Tại tôi quên mang theo chìa khóa, nên không thể vào nhà.",
            "Do trời mưa, chuyến đi bị hoãn lại.",
            "Tại anh ấy đến muộn, chúng tôi phải chờ đợi."
        ]
    },
    {
        "id": 3,
        "category": "③ Biểu thị mục đích・mục tiêu",
        "title": "～ために",
        "formation": "Động từ (thể từ điển) / Danh từ + の + ために",
        "explanation_vn": "Để làm... (để đạt được mục đích).\n",
        "explanation_jp": "前件の目的を達成するために後件の行動をすることを表す。",
        "examples_jp": [
            "日本語能力試験に合格するために、毎日勉強しています。",
            "健康のために、野菜をたくさん食べます。",
            "夢を叶えるために、一生懸命頑張る。"
        ],
        "examples_vn": [
            "Để mua nhà, tôi đang tiết kiệm tiền.",
            "Để không bị cảm, tôi sẽ mặc thêm áo.",
            "Tôi làm thêm để có tiền đi du lịch."
        ]
    }
    // ... (rest of the data)
    ];

    const grammarDataN2 = [
    {
        "id": 1,
        "category": "Ngữ pháp N2",
        "title": "〜ことになる",
        "formation": "",
        "explanation_vn": "Diễn tả việc đã được quyết định hoặc xảy ra như một kết quả (thường không do người nói tự quyết)。",
        "explanation_jp": "",
        "examples_jp": [
            "来月から新しい先生が来ることになった。",
            "会社の都合で、部署の異動があることになった。",
            "契約の都合で、開催日が変更になることになった。"
        ],
        "examples_vn": [
            "Đã được sắp xếp để tôi quản lý lớp buổi tối.",
            "Cuộc họp bất ngờ bị đẩy lùi theo lịch công ty.",
            "Kế hoạch ban đầu thay đổi vì yêu cầu đối tác."
        ]
    },
    {
        "id": 2,
        "category": "Ngữ pháp N2",
        "title": "〜ことにする",
        "formation": "",
        "explanation_vn": "Người nói tự quyết định làm (hoặc không làm) một việc。",
        "explanation_jp": "",
        "examples_jp": [
            "健康のために毎朝ジョギングすることにした。",
            "今年は海外旅行に行かないことにしました。",
            "毎晩日本語を30分勉強することにする。"
        ],
        "examples_vn": [
            "Mình quyết định sẽ học thêm từ vựng mỗi tối.",
            "Tôi định hạn chế ăn ngoài để tiết kiệm chi phí.",
            "Chúng tôi quyết định tổ chức buổi gặp mặt học viên mỗi tháng."
        ]
    }
    // ... (rest of the data)
    ];

    const [activeLevel, setActiveLevel] = useState('n3');
    const [currentGrammarIndex, setCurrentGrammarIndex] = useState(0);
    const [completedStatus, setCompletedStatus] = useState<CompletedStatus>({});
    const [memos, setMemos] = useState<Memo[]>([]);
    const [isSidebarHidden, setSidebarHidden] = useState(false);
    const [memoFontSize, setMemoFontSize] = useState(16);

    const data = activeLevel === 'n3' ? grammarData : grammarDataN2;
    const currentGrammar = data[currentGrammarIndex];

    useEffect(() => {
        const savedStatus = localStorage.getItem('completedStatus');
        if (savedStatus) {
            setCompletedStatus(JSON.parse(savedStatus));
        }
        const savedMemos = localStorage.getItem('memos');
        if (savedMemos) {
            setMemos(JSON.parse(savedMemos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('completedStatus', JSON.stringify(completedStatus));
    }, [completedStatus]);

    useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(memos));
    }, [memos]);

    const toggleStatus = () => {
        const newStatus = { ...completedStatus };
        newStatus[currentGrammar.id] = !newStatus[currentGrammar.id];
        setCompletedStatus(newStatus);
    };

    const addMemo = () => {
        const newMemo: Memo = {
            id: Date.now(),
            x: 50,
            y: 50,
            content: ''
        };
        setMemos([...memos, newMemo]);
    };

    const clearMemos = () => {
        setMemos([]);
    };

    const updateMemoContent = (id: number, content: string) => {
        const newMemos = memos.map(memo => memo.id === id ? { ...memo, content } : memo);
        setMemos(newMemos);
    };

    const closeMemo = (id: number) => {
        setMemos(memos.filter(memo => memo.id !== id));
    };


    return (
        <div className={`app-wrapper ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
            <aside className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h3>Ngữ pháp {activeLevel.toUpperCase()}</h3>
                    <div className="level-switcher">
                        <button className={`level-btn ${activeLevel === 'n3' ? 'active' : ''}`} onClick={() => setActiveLevel('n3')}>N3</button>
                        <button className={`level-btn ${activeLevel === 'n2' ? 'active' : ''}`} onClick={() => setActiveLevel('n2')}>N2</button>
                    </div>
                    <button className="toggle-menu-btn" onClick={() => setSidebarHidden(!isSidebarHidden)}>☰</button>
                </div>
                <ul className="grammar-list">
                    {data.map((item, index) => (
                        <li 
                            key={item.id} 
                            className={`${index === currentGrammarIndex ? 'active' : ''} ${completedStatus[item.id] ? 'completed' : ''}`}
                            onClick={() => setCurrentGrammarIndex(index)}
                        >
                            <span className="status-indicator"></span> {item.title}
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="main-content">
                <div className="container">
                    <header className="header">
                        <h2>{currentGrammar.category}</h2>
                    </header>

                    <main className="content-card">
                        <div className="card-header">
                            <h1>{currentGrammar.title}</h1>
                            <button 
                                className={`status-btn ${completedStatus[currentGrammar.id] ? 'completed' : ''}`}
                                onClick={toggleStatus}
                            >
                                {completedStatus[currentGrammar.id] ? 'Đã học' : 'Đánh dấu đã học'}
                            </button>
                        </div>

                        <div className="formation-block">
                            <pre>{currentGrammar.formation}</pre>
                        </div>
                        
                        <div className="explanation">
                            <p className="lang-jp">{currentGrammar.explanation_jp}</p>
                            <p className="lang-vn">{currentGrammar.explanation_vn}</p>
                        </div>

                        <div className="examples">
                            <div className="example-block">
                                <h3>Ví dụ (JP)</h3>
                                <ul>
                                    {currentGrammar.examples_jp.map((ex, i) => <li key={i}>{ex}</li>)}
                                </ul>
                            </div>
                            <div className="example-block">
                                <h3>Ví dụ (VN)</h3>
                                <ul>
                                    {currentGrammar.examples_vn.map((ex, i) => <li key={i}>{ex}</li>)}
                                </ul>
                            </div>
                        </div>
                    </main>

                    <nav className="navigation">
                        <button className="nav-btn" onClick={() => setCurrentGrammarIndex(prev => Math.max(0, prev - 1))}>Trở về</button>
                        <div className="page-number">
                            <span>{currentGrammarIndex + 1}</span> / <span>{data.length}</span>
                        </div>
                        <button className="nav-btn" onClick={() => setCurrentGrammarIndex(prev => Math.min(data.length - 1, prev + 1))}>Tiến lên</button>
                    </nav>

                    <div className="memo-controls">
                        <button className="memo-btn" onClick={addMemo}>Thêm Ghi chú (+)</button>
                        <button className="memo-btn clear-btn" onClick={clearMemos}>Xóa hết Ghi chú</button>
                        <div className="font-size-controls">
                            <button className="memo-btn font-btn" onClick={() => setMemoFontSize(s => s - 1)}>-</button>
                            <span>{memoFontSize}px</span>
                            <button className="memo-btn font-btn" onClick={() => setMemoFontSize(s => s + 1)}>+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="memo-container">
                {memos.map(memo => (
                    <div key={memo.id} className="memo-box" style={{ top: memo.y, left: memo.x }}>
                        <div className="memo-header">
                            <span>Ghi chú</span>
                            <button className="close-memo-btn" onClick={() => closeMemo(memo.id)}>×</button>
                        </div>
                        <textarea 
                            value={memo.content} 
                            onChange={(e) => updateMemoContent(memo.id, e.target.value)}
                            style={{ fontSize: `${memoFontSize}px` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GrammarPage;
