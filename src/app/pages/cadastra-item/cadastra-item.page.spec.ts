import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastraItemPage } from './cadastra-item.page';

describe('CadastraItemPage', () => {
  let component: CadastraItemPage;
  let fixture: ComponentFixture<CadastraItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastraItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastraItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
