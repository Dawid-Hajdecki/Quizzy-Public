import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Image from './bg.jpg';   
import './App.scss';

import Home from './components/home/home';
import Auth from './components/auth/auth';
import Profile from './components/profile/profile'
import Groups from './components/groups/groups';

import ViewGroups from './components/groups/groupActions/ViewGroup';
import CreateGroups from './components/groups/groupActions/CreateGroup';
import EditGroups from './components/groups/groupActions/EditGroup';

import ViewQuiz from './components/groups/quizActions/ViewQuiz';
import CreateQuiz from './components/groups/quizActions/CreateQuiz';
import EditQuiz from './components/groups/quizActions/EditQuiz';

import ViewQuestions from './components/groups/questionActions/ViewQuestions';
import CreateQuestions from './components/groups/questionActions/CreateQuestions';
import EditQuestions from './components/groups/questionActions/EditQuestions';
import UserAttempted from './components/groups/questionActions/UserAttempted';

const App = () => {
	return (
		<div id="background" style={{ backgroundImage: `url(${Image})`}}>
			<div id="overlay">
				<BrowserRouter>
					<Switch>
						<Route path="/" exact component={Home} />
						
						<Route path="/auth" exact component={Auth} />
						<Route path="/profile:id" exact component={Profile} />

						<Route path="/groups" exact component={Groups} />
						<Route path="/groups/create" exact component={CreateGroups} />
						<Route path="/groups:id/edit" exact component={EditGroups} />
						<Route path="/groups:id" exact component={ViewGroups} />

						<Route path="/groups:id/quiz/create" exact component={CreateQuiz} />
						<Route path="/groups:id/quiz:id/edit" exact component={EditQuiz} />
						<Route path="/groups:id/quiz:id" exact component={ViewQuiz} />

						<Route path="/groups:id/quiz:id/questions" exact component={ViewQuestions} />
						<Route path="/groups:id/quiz:id/question/user:email" exact component={UserAttempted} />
						<Route path="/groups:id/quiz:id/questions/create" exact component={CreateQuestions} />
						<Route path="/groups:id/quiz:id/questions:id/edit" exact component={EditQuestions} />
					</Switch>
				</BrowserRouter>
			</div>
		</div>
	);
}

export default App;
