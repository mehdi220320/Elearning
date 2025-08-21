const TestService = require('./TestService');
const catchAsync = require('./catchAsync');

exports.createTest = catchAsync(async (req, res, next) => {
    const test = await TestService.createTest(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            test
        }
    });
});

exports.getAllTests = catchAsync(async (req, res, next) => {
    const tests = await TestService.getAllTests(req.query);
    res.status(200).json({
        status: 'success',
        results: tests.length,
        data: {
            tests
        }
    });
});

exports.getTest = catchAsync(async (req, res, next) => {
    const test = await TestService.getTestById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            test
        }
    });
});

exports.getTestsByChapter = catchAsync(async (req, res, next) => {
    const tests = await TestService.getTestsByChapterId(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            tests
        }
    });
});


exports.updateTest = catchAsync(async (req, res, next) => {
    const test = await TestService.updateTest(req.params.id, req.body, req.user.id);
    res.status(200).json({
        status: 'success',
        data: {
            test
        }
    });
});

exports.deleteTest = catchAsync(async (req, res, next) => {
    await TestService.deleteTest(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.submitTest = catchAsync(async (req, res, next) => {
    const result = await TestService.submitTest(
        req.params.id,
        req.body.userid,
        req.body.responses
    );
    res.status(200).json({
        status: 'success',
        data: {
            result
        }
    });
});

exports.getUserResults = catchAsync(async (req, res, next) => {
    const results = await TestService.getUserResults(req.params.id, req.user.id);
    res.status(200).json({
        status: 'success',
        data: {
            results
        }
    });
});