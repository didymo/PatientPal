import {TestBed} from '@angular/core/testing';

import {BuildFormService} from './build-form.service';

describe('BuildFormService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: BuildFormService = TestBed.get(BuildFormService);
        expect(service).toBeTruthy();
    });
});
