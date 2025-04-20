class SubjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchSubjects();
    }

    fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.result === 'SUCCESS') {
                this.setState({ subjects: data.data, loading: false });
            } else {
                this.setState({ error: data.message, loading: false });
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            this.setState({ 
                error: `Failed to fetch subjects: ${error.message}`, 
                loading: false 
            });
        }
    };

    render() {
        const { subjects, loading, error } = this.state;

        if (loading) {
            return <div className="loading">Loading...</div>;
        }

        if (error) {
            return <div className="error">{error}</div>;
        }

        return (
            <div className="subject-list">
                {subjects.map(subject => (
                    <div key={subject.id} className="subject-card">
                        <h3>{subject.name}</h3>
                        <p>{subject.description}</p>
                        <button className="button" onClick={() => this.viewSubject(subject.id)}>
                            View Questions
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    viewSubject = (id) => {
        // TODO: Implement subject view
        console.log('Viewing subject:', id);
    };
}

ReactDOM.render(<SubjectList />, document.getElementById('root')); 