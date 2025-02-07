const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

const firebaseConfig = {
    apiKey: "AIzaSyDPC5XW7qwNtktjBwGNCY7VrAifIwKChtk",
    authDomain: "web2568-9fb97.firebaseapp.com",
    projectId: "web2568-9fb97",
    storageBucket: "web2568-9fb97.firebasestorage.app",
    messagingSenderId: "743590747675",
    appId: "1:743590747675:web:ebc02ef52de8c55636e2be",
    measurementId: "G-0T3SLJ6NW1",
};

class App extends React.Component {
    title = (
        <Alert variant="info" className="text-center">
            <b className="fs-3">Work6 :</b> <span className="fs-4">Firebase</span>
        </Alert>
    );

    footer = (
        <div className="text-center mt-3">
            <b>By ณัฐณิชา รัตน์เพ็ชร</b><br />
            <b>663380001-1</b>
        </div>
    );

    state = {
        scene: 0,
        students: [],
        id: "",
        title: "",
        fname: "",
        Iname: "",
        email: "",
    };

    edit(std) {
        this.setState({ ...std });
    }

    componentDidMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app();
        }
        this.readData();
    }

    render() {
        return (
            <Card className="shadow p-3 mb-5 bg-white rounded">
                <Card.Header>{this.title}</Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-start gap-2 mb-3">
                        <Button variant="primary" onClick={() => this.readData()}>Read Data</Button>
                        <Button variant="primary" onClick={() => this.autoRead()}>Auto Read</Button>
                    </div>
                    <StudentTable data={this.state.students} app={this} />
                </Card.Body>
                <Card.Footer className="bg-light">
                    <h5 className="text-center">เพิ่ม/แก้ไขข้อมูล นักศึกษา</h5>
                    <div className="row">
                        <div className="col-md-2"><TextInput label="ID" app={this} value="id" /></div>
                        <div className="col-md-2"><TextInput label="คำนำหน้า" app={this} value="title" /></div>
                        <div className="col-md-2"><TextInput label="ชื่อ" app={this} value="fname" /></div>
                        <div className="col-md-2"><TextInput label="สกุล" app={this} value="Iname" /></div>
                        <div className="col-md-4"><TextInput label="Email" app={this} value="email" /></div>
                    </div>
                    <div className="text-center mt-3">
                        <Button variant="success" onClick={() => this.insertData()}>Save</Button>
                    </div>
                </Card.Footer>
                <Card.Footer>{this.footer}</Card.Footer>
            </Card>
        );
    }

    readData() {
        const db = firebase.firestore();
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        }).catch((error) => console.error("Error getting documents: ", error));
    }

    autoRead() {
        const db = firebase.firestore();
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    insertData() {
        const db = firebase.firestore();
        db.collection("students").doc(this.state.id).set({
            title: this.state.title,
            fname: this.state.fname,
            Iname: this.state.Iname,
            email: this.state.email,
        }).then(() => {
            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
            this.readData();
        }).catch((error) => console.error("Error writing document: ", error));
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            const db = firebase.firestore();
            db.collection("students").doc(std.id).delete().then(() => {
                alert("ข้อมูลถูกลบเรียบร้อยแล้ว");
                this.readData();
            }).catch((error) => console.error("Error deleting document: ", error));
        }
    }
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);

function StudentTable({ data, app }) {
    return (
        <Table striped bordered hover className="text-center">
            <thead className="table-dark">
                <tr>
                    <th>รหัส</th>
                    <th>คำนำหน้า</th>
                    <th>ชื่อ</th>
                    <th>สกุล</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((s) => (
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.title}</td>
                        <td>{s.fname}</td>
                        <td>{s.Iname}</td>
                        <td>{s.email}</td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => app.edit(s)}>แก้ไข</Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => app.delete(s)}>ลบ</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

function TextInput({ label, app, value }) {
    return (
        <div className="form-group">
            <label>{label}:</label>
            <input className="form-control" value={app.state[value]} onChange={(ev) => app.setState({ [value]: ev.target.value })} />
        </div>
    );
}