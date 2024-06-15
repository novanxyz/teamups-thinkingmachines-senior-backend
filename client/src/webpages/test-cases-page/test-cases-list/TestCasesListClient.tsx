import { Col, List, Row } from 'antd';
import { ITestCaseConfig, TEST_CASES } from '../test-cases-constants';
import TestCaseListItemClient from './test-case-list-item/TestCaseListItemClient';

export default function TestCasesListClient() {
  return (
    <div>
      <Row>
        <Col span={12}>
          <List<ITestCaseConfig>
            dataSource={TEST_CASES}
            renderItem={(testCaseConfig) => (
              <TestCaseListItemClient testCaseConfig={testCaseConfig} />
            )}
          />
        </Col>
      </Row>
    </div>
  );
}
