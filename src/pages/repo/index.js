/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Spin, Row, Col, Tabs, Tag } from 'antd';
import Octicon from 'react-octicon';
import moment from 'moment';

const TabPane = Tabs.TabPane;

import github from '../../lib/github';
import GithubColors from '../../lib/github-colors.json';
import RepoReadme from '../../component/repo-readme';
import RepoEvents from '../../component/repo-events';

import './index.css';

class Repo extends Component {
  state = {
    repo: {},
    readme: '',
    events: [],
    repoLoading: false
  };

  async componentWillMount() {
    await this.getData(this.props);
  }

  async componentWillReceiveProps(nextProp) {
    const { repo } = nextProp.match.params;
    if (repo && repo !== this.props.match.params.repo) {
      await this.getData(nextProp);
    }
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  async getData(props) {
    if (this.state.loading) return;
    const { owner, repo } = props.match.params;
    await this.getRepo(owner, repo);
  }

  async getRepo(owner, repo) {
    let data = null;
    try {
      await this.setStateAsync({ repoLoading: true });
      const res = await github.get(`/repos/${owner}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8'
        }
      });
      data = res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
    this.setState({ repo: data || {}, repoLoading: false });
    return data;
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <Spin spinning={this.state.repoLoading} delay={0} tip="Loading...">
            <div style={{ padding: '2.4rem' }}>
              <h1>
                <a target="_blank" href={this.state.repo.html_url}>
                  {this.state.repo.name}
                </a>
              </h1>

              {this.state.repo && this.state.repo.homepage
                ? <div className="github-meta">
                    <span className="mr5">
                      <a href={this.state.repo.homepage} target="_blank">
                        {this.state.repo.homepage}
                      </a>
                    </span>
                  </div>
                : ''}

              <div className="github-meta">
                <span className="mr5">
                  <span
                    className="repo-language-color mr5"
                    style={{
                      backgroundColor: GithubColors[this.state.repo.language]
                        ? GithubColors[this.state.repo.language].color
                        : ''
                    }}
                  />
                  <span>
                    {GithubColors[this.state.repo.language]
                      ? this.state.repo.language
                      : 'Unkown'}
                  </span>
                </span>
              </div>

              <div className="github-meta">
                <span
                  className="mr5"
                  title={'Watch ' + this.state.repo.subscribers_count}
                >
                  <Octicon className="font-size-2rem mr5" name="eye" mega />
                  <span>{this.state.repo.subscribers_count}</span>
                </span>
                <span
                  className="mr5"
                  title={'Star ' + this.state.repo.watchers_count}
                >
                  <Octicon className="font-size-2rem mr5" name="star" mega />
                  <span>{this.state.repo.watchers_count}</span>
                </span>
                <span
                  title={'Fork ' + this.state.repo.forks_count}
                  className="mr5"
                >
                  <Octicon
                    className="font-size-2rem mr5"
                    name="gist-fork"
                    mega
                  />
                  <span>{this.state.repo.forks_count}</span>
                </span>
                <span
                  title={'Issue opened ' + this.state.repo.open_issues_count}
                  className="mr5"
                >
                  <Octicon
                    className="font-size-2rem mr5"
                    name="issue-opened"
                    mega
                  />
                  <span>{this.state.repo.open_issues_count}</span>
                </span>
              </div>

              <div className="github-meta">
                <div>
                  {(this.state.repo.topics || []).map(topic => {
                    return (
                      <Tag style={{ marginTop: '0.5rem' }} key={topic}>
                        {topic}
                      </Tag>
                    );
                  })}
                </div>
              </div>

              <div className="github-meta">
                Create at
                {' '}
                {this.state.repo.created_at &&
                  moment(this.state.repo.created_at).fromNow()}
              </div>
              <div className="github-meta">
                Update at
                {' '}
                {this.state.repo.updated_at &&
                  moment(this.state.repo.updated_at).fromNow()}
              </div>
            </div>
          </Spin>
          <div style={{ padding: '2.4rem' }}>
            <Tabs defaultActiveKey="readme">
              <TabPane tab="项目介绍" key="readme">
                <RepoReadme
                  repo={this.state.repo}
                  {...this.props.match.params}
                />
              </TabPane>
              <TabPane tab="最近活动" key="events">
                <RepoEvents
                  repo={this.state.repo}
                  {...this.props.match.params}
                />
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    );
  }
}
export default Repo;
