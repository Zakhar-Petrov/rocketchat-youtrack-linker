import {expect} from 'chai';
import {IssueIterator} from './IssueIterator';

function iterationsOf(issueIterator: IssueIterator) {
    const iterations: Array<{ text: string, index: number }> = [];

    for (const result of issueIterator) {
        iterations.push(result!);
    }
    return iterations;
}

describe('IssueIterator', () => {
    const text = 'test0 qwerty test1 asdfgh test2 (test3)';

    it('has all iterations', () => {
        const expectedIterations: Array<{ text: string, index: number }> = [
            {text: 'test0', index: 0},
            {text: 'test1', index: 13},
            {text: 'test2', index: 26},
            {text: 'test3', index: 33},
        ];
        const issueIterator = new IssueIterator(text, 'test[0-9]');

        const iterations = iterationsOf(issueIterator);

        expect(iterations).to.eql(expectedIterations);
    });

    it('has iterations without excluded matches', () => {
        const expectedIterations: Array<{ text: string, index: number }> = [
            {text: 'test0', index: 0},
            {text: 'test2', index: 26},
            {text: 'test3', index: 33},
        ];
        const issueIterator = new IssueIterator(text, 'test[0-9]', 'test1');

        const iterations = iterationsOf(issueIterator);

        expect(iterations).to.eql(expectedIterations);
    });

    it('has defined max search attempts', () => {
        const issueIterator = new IssueIterator(text, 'test[0-9]', undefined, 3);

        const iterations = iterationsOf(issueIterator);

        expect(iterations.length).to.equal(3);
    });
});
